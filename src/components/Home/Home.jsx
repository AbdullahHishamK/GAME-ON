import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'https://free-to-play-games-database.p.rapidapi.com/api/games';
const API_HOST = 'free-to-play-games-database.p.rapidapi.com';

const Home = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const carouselRef = useRef(null);
  const autoplayRef = useRef();
  const navigate = useNavigate();

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  useEffect(() => {
    const fetchGames = async () => {
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
        setGames(data);
      } catch (err) {
        setError(err.message);
        setGames([]);
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  // Carousel navigation handlers
  const handlePrev = () => {
    setFade(false);
    setTimeout(() => {
      setCarouselIndex((prev) => (prev === 0 ? games.length - 1 : prev - 1));
      setFade(true);
    }, 200);
  };
  const handleNext = () => {
    setFade(false);
    setTimeout(() => {
      setCarouselIndex((prev) => (prev === games.length - 1 ? 0 : prev + 1));
      setFade(true);
    }, 200);
  };

  // Touch handlers for mobile swipe
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    }
    if (isRightSwipe) {
      handlePrev();
    }
  };

  // Autoplay effect
  useEffect(() => {
    if (!games.length) return;
    if (isPaused) return;
    autoplayRef.current = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCarouselIndex((prev) => (prev === games.length - 1 ? 0 : prev + 1));
        setFade(true);
      }, 200);
    }, 2000);
    return () => clearInterval(autoplayRef.current);
  }, [games, isPaused]);

  // Pause on hover (desktop only)
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line
  }, [games, carouselIndex]);

  // Group games by genre
  const gamesByGenre = React.useMemo(() => {
    const map = {};
    games.forEach((game) => {
      if (!game.genre) return;
      if (!map[game.genre]) map[game.genre] = [];
      map[game.genre].push(game);
    });
    return map;
  }, [games]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col items-center justify-center px-4 py-12">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-center mb-6 drop-shadow-lg">Welcome to Game On</h1>
      <p className="text-base md:text-lg lg:text-xl text-center text-gray-300 mb-10 max-w-2xl px-4">
        Discover and explore free-to-play games from around the world. Browse by genre, publisher, and more!
      </p>
      {/* Carousel (now under the title) */}
      {!loading && !error && Array.isArray(games) && games.length > 0 && (
        <div className="w-full flex flex-col items-center mb-16"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div 
            className="relative w-full max-w-5xl h-[20rem] sm:h-[24rem] md:h-[28rem] flex items-center justify-center select-none overflow-hidden rounded-2xl md:rounded-3xl" 
            ref={carouselRef}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <button
              onClick={handlePrev}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-70 hover:bg-blue-700 hover:scale-110 text-white rounded-full p-3 md:p-4 lg:p-6 z-5 shadow-lg transition-all duration-200 text-2xl md:text-4xl lg:text-5xl flex items-center justify-center"
              aria-label="Previous"
              style={{ boxShadow: '0 4px 24px 0 rgba(0,0,0,0.3)' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div className="flex-1 flex justify-center items-center h-full">
              <div 
                className={`relative w-full h-full flex items-center justify-center transition-all duration-500 cursor-pointer hover:scale-105 ${fade ? 'opacity-100 scale-105' : 'opacity-0 scale-95'}`} 
                style={{height: '100%'}}
                onClick={() => navigate(`/details/${games[carouselIndex].id}`)}
                title={`View details for ${games[carouselIndex].title}`}
              >
                <img
                  src={games[carouselIndex].thumbnail}
                  alt={games[carouselIndex].title}
                  className="w-full h-full object-cover transition-all duration-500"
                  style={{ boxShadow: '0 12px 48px 0 rgba(0,0,0,0.6)' }}
                />
                {/* Gradient overlay at bottom */}
                <div className="absolute bottom-0 left-0 w-full h-24 md:h-32 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                {/* Overlayed title */}
                <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 px-4 md:px-6 lg:px-10 py-2 md:py-4 rounded-xl md:rounded-2xl shadow text-sm md:text-lg lg:text-2xl font-bold text-blue-200 backdrop-blur bg-black/60">
                  {games[carouselIndex].title}
                </div>
              </div>
            </div>
            <button
              onClick={handleNext}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-70 hover:bg-blue-700 hover:scale-110 text-white rounded-full p-3 md:p-4 lg:p-6 z-5 shadow-lg transition-all duration-200 text-2xl md:text-4xl lg:text-5xl flex items-center justify-center"
              aria-label="Next"
              style={{ boxShadow: '0 4px 24px 0 rgba(0,0,0,0.3)' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
          {/* Dots indicator */}
          <div className="flex gap-2 md:gap-3 mt-4 md:mt-6 px-4">
            {games.slice(0, 8).map((_, idx) => (
              <span
                key={idx}
                className={`w-3 h-3 md:w-4 md:h-4 rounded-full ${carouselIndex === idx ? 'bg-blue-400' : 'bg-gray-600'} transition-all duration-200`}
                style={{ display: 'inline-block' }}
              />
            ))}
            {games.length > 8 && <span className="text-sm md:text-base text-gray-400 ml-2">+{games.length - 8}</span>}
          </div>
        </div>
      )}
      {loading && (
        <div className="text-xl md:text-2xl text-center my-12">Loading games...</div>
      )}
      {error && (
        <div className="text-center text-red-400 my-12 px-4">{error}</div>
      )}
      {/* Genre sections */}
      {!loading && !error && Object.keys(gamesByGenre).length > 0 && (
        <div className="w-full max-w-6xl mx-auto mt-12 px-4">
          {Object.entries(gamesByGenre).map(([genre, genreGames]) => (
            <div key={genre} className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-blue-400 mb-6 border-l-4 border-blue-600 pl-4">{genre}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                {genreGames.slice(0, 4).map((game) => (
                  <div
                    key={game.id}
                    className="bg-gray-800 bg-opacity-90 rounded-xl shadow-lg p-4 md:p-6 flex flex-col items-center hover:scale-105 transition-transform duration-200 border border-gray-700 cursor-pointer"
                    onClick={() => navigate(`/details/${game.id}`)}
                    title={`View details for ${game.title}`}
                  >
                    <img
                      src={game.thumbnail}
                      alt={game.title}
                      className="w-full h-32 md:h-40 object-cover rounded mb-4 border-2 border-blue-600"
                    />
                    <h3 className="text-lg md:text-xl font-bold mb-2 text-blue-300 text-center">{game.title}</h3>
                    <p className="text-xs md:text-sm text-gray-300 mb-1"><span className="font-semibold text-white">Platform:</span> {game.platform}</p>
                    <p className="text-xs md:text-sm text-gray-300 mb-1"><span className="font-semibold text-white">Publisher:</span> {game.publisher}</p>
                    <p className="text-xs md:text-sm text-gray-300 mb-1"><span className="font-semibold text-white">Genre:</span> {game.genre}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
