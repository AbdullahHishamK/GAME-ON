import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API_URL = 'https://free-to-play-games-database.p.rapidapi.com/api/games';
const API_HOST = 'free-to-play-games-database.p.rapidapi.com';

const PublishersGame = () => {
  const { publisherName } = useParams();
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [gamesPerPage] = useState(20);

  useEffect(() => {
    const fetchGames = async () => {
      if (!publisherName) {
        setError('No publisher name provided');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(API_URL, {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': '4230592d51msh12cefa35528855ep17be02jsn2f3a0ac77601',
            'X-RapidAPI-Host': API_HOST,
          },
        });
        
        if (!response.ok) {
          if (response.status === 403) {
            throw new Error('403 Forbidden: Your API key is missing, invalid, or you are not subscribed to the API.');
          } else if (response.status === 429) {
            throw new Error('429 Too Many Requests: You have exceeded the API rate limit. Please wait and try again later.');
          } else {
            throw new Error('Failed to fetch games. Check your API key and subscription.');
          }
        }
        
        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error('API did not return an array.');
        }
        
        // Filter games by publisher
        const decodedPublisherName = decodeURIComponent(publisherName);
        const publisherGames = data.filter(game => 
          game.publisher && game.publisher.trim() === decodedPublisherName
        );
        
        // Sort games alphabetically by title
        const sortedGames = publisherGames.sort((a, b) => {
          const titleA = (a.title || '').toLowerCase();
          const titleB = (b.title || '').toLowerCase();
          return titleA.localeCompare(titleB);
        });
        
        setGames(sortedGames);
        setFilteredGames(sortedGames);
      } catch (err) {
        setError(err.message);
        setGames([]);
        setFilteredGames([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchGames();
  }, [publisherName]);

  // Filter games based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredGames(games);
      setCurrentPage(1);
      return;
    }
    
    const filtered = games.filter(game => 
      game.title && game.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredGames(filtered);
    setCurrentPage(1);
  }, [searchTerm, games]);

  // Calculate pagination
  const indexOfLastGame = currentPage * gamesPerPage;
  const indexOfFirstGame = indexOfLastGame - gamesPerPage;
  const currentGames = filteredGames.slice(indexOfFirstGame, indexOfLastGame);
  const totalPages = Math.ceil(filteredGames.length / gamesPerPage);

  const handleGameClick = (gameId) => {
    navigate(`/details/${gameId}`);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const decodedPublisherName = decodeURIComponent(publisherName || '');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col items-center justify-center px-4 py-12">
        <div className="text-2xl text-center">Loading games for {decodedPublisherName}...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col items-center justify-center px-4 py-12">
        <div className="text-center text-red-400 max-w-md">
          <h2 className="text-2xl font-bold mb-4">Error Loading Games</h2>
          <p className="mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-4 top-4 bg-black bg-opacity-60 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-all duration-200"
            aria-label="Back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
            {decodedPublisherName}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-6">
            {games.length} games by this publisher
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <input
              type="text"
              placeholder="Search games..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* Results Info */}
          <div className="text-gray-400 mb-6">
            Showing {filteredGames.length} of {games.length} games
            {searchTerm && ` matching "${searchTerm}"`}
          </div>
        </div>

        {/* Games Grid */}
        {currentGames.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
              {currentGames.map((game) => (
                <div
                  key={game.id}
                  className="bg-gray-800 bg-opacity-90 rounded-xl shadow-lg p-4 hover:scale-105 transition-transform duration-200 border border-gray-700 cursor-pointer group"
                  onClick={() => handleGameClick(game.id)}
                  title={`View details for ${game.title}`}
                >
                  <div className="relative mb-3">
                    <img
                      src={game.thumbnail}
                      alt={game.title}
                      className="w-full h-32 object-cover rounded-lg border-2 border-blue-600 group-hover:border-blue-400 transition-colors duration-200"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-xs px-2 py-1 rounded">
                      {game.platform}
                    </div>
                  </div>
                  
                  <h3 className="text-sm font-bold text-blue-300 mb-2 line-clamp-2 group-hover:text-blue-200 transition-colors duration-200">
                    {game.title}
                  </h3>
                  
                  <div className="text-xs text-gray-400 space-y-1">
                    <div className="flex justify-between">
                      <span className="font-semibold">Genre:</span>
                      <span className="truncate ml-2">{game.genre || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Publisher:</span>
                      <span className="truncate ml-2">{game.publisher || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mb-8">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors duration-200"
                >
                  Previous
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-white hover:bg-gray-600'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors duration-200"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center text-gray-400 py-12">
            <h3 className="text-xl font-semibold mb-2">No games found</h3>
            <p>Try adjusting your search terms</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublishersGame;
