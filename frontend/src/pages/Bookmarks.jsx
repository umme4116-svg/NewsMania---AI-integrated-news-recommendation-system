/**
 * Bookmarks page for News-Mania frontend.
 * Purpose: Displays user's saved/bookmarked news articles.
 * Used for personalized content management.
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import NewsCard from '../components/NewsCard';
import { toast } from 'react-toastify';

const Bookmarks = () => {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/user/bookmarks');
      if (response.data.success) {
        setBookmarks(response.data.bookmarks);
      }
    } catch (error) {
      toast.error('Failed to fetch bookmarks');
      console.error('Fetch bookmarks error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookmarkChange = () => {
    fetchBookmarks();
  };

  // Convert bookmark to article format for NewsCard
  const bookmarkToArticle = (bookmark) => ({
    articleId: bookmark.articleId,
    title: bookmark.title,
    description: '',
    image: bookmark.image,
    url: bookmark.url,
    source: bookmark.source,
    category: bookmark.category,
    publishedAt: bookmark.publishedAt,
    likes: 0,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">My Bookmarks</h1>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            You haven't bookmarked any articles yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map((bookmark) => (
            <NewsCard
              key={bookmark.articleId}
              article={bookmarkToArticle(bookmark)}
              onBookmarkChange={handleBookmarkChange}
              showRemoveButton={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;

