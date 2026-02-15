/**
 * Search page for News-Mania frontend.
 * Purpose: Handles news search functionality with query parameters and results display.
 * Used for finding specific news articles.
 */

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import NewsCard from '../components/NewsCard';
import NewsCardSkeleton from '../components/NewsCardSkeleton';
import { toast } from 'react-toastify';
import { FaSearch } from 'react-icons/fa';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(query);

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query]);

  const performSearch = async (searchTerm) => {
    if (!searchTerm.trim()) return;

    try {
      setLoading(true);
      const response = await api.get(`/news/search?q=${encodeURIComponent(searchTerm)}`);
      if (response.data.success) {
        setArticles(response.data.articles || []);
        if (response.data.articles && response.data.articles.length === 0) {
          toast.info('No articles found for this search. Try a different topic.');
        }
      } else {
        setArticles([]);
        toast.error(response.data.message || 'No relevant news found. Try another topic.');
      }
    } catch (error) {
      toast.error('Unable to fetch news. Please try again later.');
      setArticles([]);
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.history.pushState({}, '', `/search?q=${encodeURIComponent(searchQuery.trim())}`);
      performSearch(searchQuery.trim());
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for news..."
              className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            />
            <FaSearch className="absolute left-4 top-4 text-gray-400 text-xl" />
            <button
              type="submit"
              className="absolute right-2 top-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {query && (
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Search Results for: <span className="text-blue-600 dark:text-blue-400">"{query}"</span>
          </h1>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <NewsCardSkeleton key={i} />
          ))}
        </div>
      ) : articles.length === 0 && query ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 dark:text-gray-400">
            No relevant news found. Try another topic.
          </p>
        </div>
      ) : articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <NewsCard key={article.articleId} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            Enter a search query to find news articles
          </p>
        </div>
      )}
    </div>
  );
};

export default Search;

