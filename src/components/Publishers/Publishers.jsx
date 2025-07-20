import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'https://free-to-play-games-database.p.rapidapi.com/api/games';
const API_HOST = 'free-to-play-games-database.p.rapidapi.com';

const Publishers = () => {
  const [publishers, setPublishers] = useState([]);
  const [filteredPublishers, setFilteredPublishers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [publishersPerPage] = useState(20);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPublishers = async () => {
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
        
        // Extract unique publishers and count their games
        const publisherMap = {};
        data.forEach(game => {
          if (game.publisher && game.publisher.trim()) {
            const publisher = game.publisher.trim();
            if (!publisherMap[publisher]) {
              publisherMap[publisher] = {
                name: publisher,
                gameCount: 0,
                games: [],
                sampleGames: []
              };
            }
            publisherMap[publisher].gameCount++;
            publisherMap[publisher].games.push(game);
            // Keep up to 3 sample games for display
            if (publisherMap[publisher].sampleGames.length < 3) {
              publisherMap[publisher].sampleGames.push(game);
            }
          }
        });
        
        // Convert to array and shuffle randomly
        const publishersArray = Object.values(publisherMap).sort(() => Math.random() - 0.5);
        
        setPublishers(publishersArray);
        setFilteredPublishers(publishersArray);
      } catch (err) {
        setError(err.message);
        setPublishers([]);
        setFilteredPublishers([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPublishers();
  }, []);

  // Filter publishers based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredPublishers(publishers);
      setCurrentPage(1);
      return;
    }
    
    const filtered = publishers.filter(publisher => 
      publisher.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPublishers(filtered);
    setCurrentPage(1);
  }, [searchTerm, publishers]);

  // Calculate pagination
  const indexOfLastPublisher = currentPage * publishersPerPage;
  const indexOfFirstPublisher = indexOfLastPublisher - publishersPerPage;
  const currentPublishers = filteredPublishers.slice(indexOfFirstPublisher, indexOfLastPublisher);
  const totalPages = Math.ceil(filteredPublishers.length / publishersPerPage);

  const handlePublisherClick = (publisherName) => {
    // Navigate to the publisher games page
    navigate(`/publisher-games/${encodeURIComponent(publisherName)}`);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col items-center justify-center px-4 py-12">
        <div className="text-2xl text-center">Loading publishers...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col items-center justify-center px-4 py-12">
        <div className="text-center text-red-400 max-w-md">
          <h2 className="text-2xl font-bold mb-4">Error Loading Publishers</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">All Publishers</h1>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <input
              type="text"
              placeholder="Search publishers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Publishers Grid */}
        {currentPublishers.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
              {currentPublishers.map((publisher) => (
                <div
                  key={publisher.name}
                  className="bg-gray-800 bg-opacity-90 rounded-xl shadow-lg p-4 hover:scale-105 transition-transform duration-200 border border-gray-700 cursor-pointer group"
                  onClick={() => handlePublisherClick(publisher.name)}
                  title={`${publisher.name} - ${publisher.gameCount} games`}
                >
                  <div className="relative mb-3">
                    {/* Publisher logo/icon placeholder */}
                    <div className="w-full h-32 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                      <div className="text-white text-4xl font-bold">
                        {publisher.name.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-xs px-2 py-1 rounded">
                      {publisher.gameCount} games
                    </div>
                  </div>
                  
                  <h3 className="text-sm font-bold text-blue-300 mb-2 line-clamp-2 group-hover:text-blue-200 transition-colors duration-200">
                    {publisher.name}
                  </h3>
                  
                  <div className="text-xs text-gray-400 space-y-1">
                    <div className="flex justify-between">
                      <span className="font-semibold">Games:</span>
                      <span className="ml-2">{publisher.gameCount}</span>
                    </div>
                    {publisher.sampleGames.length > 0 && (
                      <div className="text-xs text-gray-500 mt-2">
                        <span className="font-semibold">Sample games:</span>
                        <div className="mt-1 space-y-1">
                          {publisher.sampleGames.slice(0, 2).map((game, index) => (
                            <div key={index} className="truncate text-gray-400">
                              • {game.title}
                            </div>
                          ))}
                          {publisher.gameCount > 2 && (
                            <div className="text-gray-500 italic">
                              +{publisher.gameCount - 2} more
                            </div>
                          )}
                        </div>
                      </div>
                    )}
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
            <h3 className="text-xl font-semibold mb-2">No publishers found</h3>
            <p>Try adjusting your search terms</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Publishers; 