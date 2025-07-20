import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const API_URL = 'https://free-to-play-games-database.p.rapidapi.com/api/game';
const API_HOST = 'free-to-play-games-database.p.rapidapi.com';

const Details = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchGame = async () => {
      if (!id) {
        setError('No game ID provided');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        console.log('Fetching game with ID:', id);
        const response = await fetch(`${API_URL}?id=${id}`, {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': '4230592d51msh12cefa35528855ep17be02jsn2f3a0ac77601',
            'X-RapidAPI-Host': API_HOST,
          },
        });
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          if (response.status === 403) {
            throw new Error('403 Forbidden: Your API key is missing, invalid, or you are not subscribed to the API.');
          } else if (response.status === 429) {
            throw new Error('429 Too Many Requests: You have exceeded the API rate limit. Please wait and try again later.');
          } else {
            throw new Error(`Failed to fetch game details. Status: ${response.status}`);
          }
        }
        
        const data = await response.json();
        console.log('API response:', data);
        
        if (!data || typeof data !== 'object') {
          throw new Error('Invalid response from API');
        }
        
        setGame(data);
      } catch (err) {
        console.error('Error fetching game:', err);
        setError(err.message);
        setGame(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchGame();
    
    // Load comments from localStorage
    const savedComments = localStorage.getItem(`comments_${id}`);
    if (savedComments) {
      try {
        setComments(JSON.parse(savedComments));
      } catch (error) {
        console.error('Error loading comments:', error);
      }
    }
  }, [id]);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const comment = {
      id: Date.now(),
      text: newComment.trim(),
      author: user ? user.name : 'Anonymous',
      timestamp: new Date().toISOString(),
      gameId: id
    };
    
    const updatedComments = [comment, ...comments];
    setComments(updatedComments);
    setNewComment('');
    
    // Save to localStorage
    localStorage.setItem(`comments_${id}`, JSON.stringify(updatedComments));
  };

  const handleDeleteComment = (commentId) => {
    const updatedComments = comments.filter(comment => comment.id !== commentId);
    setComments(updatedComments);
    localStorage.setItem(`comments_${id}`, JSON.stringify(updatedComments));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col items-center justify-center px-4 py-12">
        <div className="text-2xl text-center">Loading game details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col items-center justify-center px-4 py-12">
        <div className="text-center text-red-400 max-w-md">
          <h2 className="text-2xl font-bold mb-4">Error Loading Game</h2>
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

  if (!game || typeof game !== 'object') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col items-center justify-center px-4 py-12">
        <div className="text-center text-gray-400 max-w-md">
          <h2 className="text-2xl font-bold mb-4">Game Not Found</h2>
          <p className="mb-4">The requested game could not be found.</p>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col items-center px-4 py-12">
      <div className="w-full max-w-4xl bg-gray-800 bg-opacity-95 rounded-2xl shadow-2xl overflow-hidden">
        {/* Back button */}
        <div className="relative">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-4 top-4 z-10 bg-black bg-opacity-60 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-all duration-200"
            aria-label="Back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          {/* Game image */}
          {game.thumbnail && typeof game.thumbnail === 'string' && (
            <img
              src={game.thumbnail}
              alt={game.title || 'Game'}
              className="w-full h-80 object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          )}
        </div>
        
        {/* Game info */}
        <div className="p-8">
          <h1 className="text-4xl font-extrabold text-blue-400 mb-4 text-center drop-shadow-lg">
            {game.title || 'No Title'}
          </h1>
          
          {game.short_description && (
            <p className="text-gray-300 text-center mb-8 text-lg max-w-3xl mx-auto">
              {game.short_description}
            </p>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-900 bg-opacity-80 rounded-lg p-4">
              <span className="font-semibold text-blue-300">Genre:</span>
              <span className="ml-2 text-gray-200">{game.genre || 'N/A'}</span>
            </div>
            <div className="bg-gray-900 bg-opacity-80 rounded-lg p-4">
              <span className="font-semibold text-blue-300">Platform:</span>
              <span className="ml-2 text-gray-200">{game.platform || 'N/A'}</span>
            </div>
            <div className="bg-gray-900 bg-opacity-80 rounded-lg p-4">
              <span className="font-semibold text-blue-300">Publisher:</span>
              <span className="ml-2 text-gray-200">{game.publisher || 'N/A'}</span>
            </div>
            <div className="bg-gray-900 bg-opacity-80 rounded-lg p-4">
              <span className="font-semibold text-blue-300">Developer:</span>
              <span className="ml-2 text-gray-200">{game.developer || 'N/A'}</span>
            </div>
            <div className="bg-gray-900 bg-opacity-80 rounded-lg p-4">
              <span className="font-semibold text-blue-300">Release Date:</span>
              <span className="ml-2 text-gray-200">{game.release_date || 'N/A'}</span>
            </div>
            <div className="bg-gray-900 bg-opacity-80 rounded-lg p-4">
              <span className="font-semibold text-blue-300">Status:</span>
              <span className="ml-2 text-gray-200">{game.status || 'N/A'}</span>
            </div>
          </div>
          
          {game.description && typeof game.description === 'string' && (
            <div className="bg-gray-900 bg-opacity-80 rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-blue-400 mb-4">Description</h2>
              <p className="text-gray-200 whitespace-pre-line leading-relaxed">
                {game.description}
              </p>
            </div>
          )}
          
          {game.game_url && typeof game.game_url === 'string' && (
            <div className="text-center">
              <a
                href={game.game_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                Play Now
              </a>
            </div>
          )}
        </div>
        
        {/* Comments Section */}
        <div className="border-t border-gray-700 p-8">
          <h2 className="text-2xl font-bold text-blue-400 mb-6">Comments</h2>
          
          {/* Add Comment Form */}
          <div className="mb-6">
            <div className="flex gap-3 items-start">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {user ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment about this game..."
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 resize-none"
                  rows="3"
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-400">
                    {user ? `Commenting as ${user.name}` : 'Commenting as Anonymous'}
                  </span>
                  <button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    Post Comment
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Comments List */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <p>No comments yet. Be the first to share your thoughts!</p>
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="bg-gray-700 bg-opacity-50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {comment.author.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-blue-300">{comment.author}</span>
                        <span className="text-xs text-gray-400">
                          {new Date(comment.timestamp).toLocaleDateString()} at {new Date(comment.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-gray-200 whitespace-pre-wrap">{comment.text}</p>
                      {user && comment.author === user.name && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-red-400 hover:text-red-300 text-sm mt-2"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;
