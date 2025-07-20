import React, { useState } from 'react';

const LatestNews = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock news data
  const newsData = [
    {
      id: 1,
      title: "New Free-to-Play Battle Royale Game Announced",
      category: "gaming",
      date: "2024-01-15",
      author: "Gaming News Team",
      excerpt: "A revolutionary new battle royale game is set to launch next month, featuring unique gameplay mechanics and stunning graphics.",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=250&fit=crop",
      readTime: "3 min read",
      featured: true
    },
    {
      id: 2,
      title: "Major Update Released for Popular RPG",
      category: "updates",
      date: "2024-01-14",
      author: "Game Updates",
      excerpt: "The highly anticipated 2.0 update brings new quests, improved graphics, and enhanced multiplayer features.",
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=250&fit=crop",
      readTime: "5 min read",
      featured: false
    },
    {
      id: 3,
      title: "Esports Tournament Announces Record Prize Pool",
      category: "esports",
      date: "2024-01-13",
      author: "Esports Central",
      excerpt: "The upcoming championship tournament will feature the largest prize pool in gaming history, attracting top players worldwide.",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop",
      readTime: "4 min read",
      featured: false
    },
    {
      id: 4,
      title: "New Gaming Console Revealed at Tech Expo",
      category: "hardware",
      date: "2024-01-12",
      author: "Tech Gaming",
      excerpt: "The next-generation console promises 4K gaming at 120fps with revolutionary controller technology.",
      image: "https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=400&h=250&fit=crop",
      readTime: "6 min read",
      featured: false
    },
    {
      id: 5,
      title: "Indie Game Developer Wins Major Award",
      category: "gaming",
      date: "2024-01-11",
      author: "Indie Spotlight",
      excerpt: "A small indie studio's innovative puzzle game has won the prestigious Game of the Year award.",
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=250&fit=crop",
      readTime: "3 min read",
      featured: false
    },
    {
      id: 6,
      title: "Virtual Reality Gaming Takes Center Stage",
      category: "technology",
      date: "2024-01-10",
      author: "VR Gaming News",
      excerpt: "New VR technology promises to revolutionize the gaming experience with unprecedented immersion levels.",
      image: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=400&h=250&fit=crop",
      readTime: "7 min read",
      featured: false
    }
  ];

  const categories = [
    { id: 'all', name: 'All News', color: 'bg-blue-600' },
    { id: 'gaming', name: 'Gaming', color: 'bg-green-600' },
    { id: 'updates', name: 'Updates', color: 'bg-purple-600' },
    { id: 'esports', name: 'Esports', color: 'bg-red-600' },
    { id: 'hardware', name: 'Hardware', color: 'bg-yellow-600' },
    { id: 'technology', name: 'Technology', color: 'bg-indigo-600' }
  ];

  // Filter news based on search and category
  const filteredNews = newsData.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredArticle = newsData.find(article => article.featured);
  const regularArticles = filteredNews.filter(article => !article.featured);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
            Latest News
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8">
            Stay updated with the latest gaming news, updates, and announcements
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search news..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category.id
                    ? `${category.color} text-white shadow-lg`
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Article */}
        {featuredArticle && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-blue-400 mb-6 border-l-4 border-blue-600 pl-4">
              Featured Story
            </h2>
            <div className="bg-gray-800 bg-opacity-95 rounded-2xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-300">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img
                    src={featuredArticle.image}
                    alt={featuredArticle.title}
                    className="w-full h-64 md:h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
                <div className="md:w-1/2 p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      categories.find(c => c.id === featuredArticle.category)?.color || 'bg-blue-600'
                    } text-white`}>
                      {categories.find(c => c.id === featuredArticle.category)?.name}
                    </span>
                    <span className="text-gray-400 text-sm">{featuredArticle.readTime}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-blue-300 mb-4 hover:text-blue-200 transition-colors duration-200">
                    {featuredArticle.title}
                  </h3>
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    {featuredArticle.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {featuredArticle.author.charAt(0)}
                      </div>
                      <span className="text-gray-400 text-sm">{featuredArticle.author}</span>
                    </div>
                    <span className="text-gray-500 text-sm">{formatDate(featuredArticle.date)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Regular Articles Grid */}
        {regularArticles.length > 0 ? (
          <div>
            <h2 className="text-2xl font-bold text-blue-400 mb-6 border-l-4 border-blue-600 pl-4">
              Latest Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularArticles.map((article) => (
                <div
                  key={article.id}
                  className="bg-gray-800 bg-opacity-95 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <div className="relative">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        categories.find(c => c.id === article.category)?.color || 'bg-blue-600'
                      } text-white`}>
                        {categories.find(c => c.id === article.category)?.name}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-blue-300 mb-3 hover:text-blue-200 transition-colors duration-200 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {article.author.charAt(0)}
                        </div>
                        <span className="text-gray-400 text-xs">{article.author}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{article.readTime}</span>
                        <span>•</span>
                        <span>{formatDate(article.date)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-400 py-12">
            <h3 className="text-xl font-semibold mb-2">No articles found</h3>
            <p>Try adjusting your search terms or category filter</p>
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
          <p className="text-blue-100 mb-6">Get the latest gaming news delivered to your inbox</p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LatestNews;
