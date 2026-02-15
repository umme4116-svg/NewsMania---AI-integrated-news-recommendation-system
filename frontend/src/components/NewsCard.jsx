/**
 * NewsCard component for News-Mania frontend.
 * Purpose: Displays individual news articles with actions like bookmark, like, and share.
 * Used for rendering news items in lists and feeds.
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { FaHeart, FaRegHeart, FaBookmark, FaShare, FaClock } from 'react-icons/fa';
import { toast } from 'react-toastify';

const NewsCard = ({ article, onBookmarkChange, showRemoveButton = false }) => {
  const { isAuthenticated, user, updateUser } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(article.likes || 0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showImage, setShowImage] = useState(
    Boolean(article.image && /^https?:\/\//i.test(article.image))
  );

  useEffect(() => {
    if (user && user.likedArticles) {
      setIsLiked(user.likedArticles.some((liked) => liked.articleId === article.articleId));
    }
    if (user && user.bookmarks) {
      setIsBookmarked(user.bookmarks.some((bookmark) => bookmark.articleId === article.articleId));
    }
    // Update image visibility when article changes
    setShowImage(Boolean(article.image && /^https?:\/\//i.test(article.image)));
  }, [user, article]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to like articles');
      return;
    }

    try {
      if (isLiked) {
        const response = await api.post(`/news/unlike/${encodeURIComponent(article.articleId)}`, { 
          url: article.url 
        });
        setLikesCount(response.data.likes);
        // Update user likedArticles
        if (user) {
          const updatedUser = {
            ...user,
            likedArticles: user.likedArticles.filter(liked => liked.articleId !== article.articleId)
          };
          updateUser(updatedUser);
        }
        setIsLiked(false);
        toast.success('Article unliked');
      } else {
        const response = await api.post(`/news/like/${encodeURIComponent(article.articleId)}`, { 
          url: article.url,
          title: article.title,
          image: article.image,
          source: article.source,
          category: article.category,
          description: article.description,
          publishedAt: article.publishedAt,
          apiSource: article.apiSource || 'newsapi',
        });
        setLikesCount(response.data.likes);
        // Update user likedArticles
        if (user) {
          const updatedUser = {
            ...user,
            likedArticles: [...user.likedArticles, { articleId: article.articleId, likedAt: new Date() }]
          };
          updateUser(updatedUser);
        }
        setIsLiked(true);
        toast.success('Article liked');
      }
    } catch (error) {
      console.error('Like error:', error);
      toast.error('Failed to like/unlike article');
    }
  };

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to bookmark articles');
      return;
    }

    try {
      if (isBookmarked) {
        await api.delete('/user/bookmarks', { data: { articleId: article.articleId } });
        setIsBookmarked(false);
        // Update user bookmarks
        if (user) {
          const updatedUser = {
            ...user,
            bookmarks: user.bookmarks.filter(bookmark => bookmark.articleId !== article.articleId)
          };
          updateUser(updatedUser);
        }
        toast.success('Bookmark removed');
        if (onBookmarkChange) onBookmarkChange();
      } else {
        await api.post('/user/bookmarks', {
          articleId: article.articleId,
          title: article.title,
          image: article.image,
          source: article.source,
          category: article.category,
          publishedAt: article.publishedAt,
          url: article.url,
        });
        setIsBookmarked(true);
        // Update user bookmarks
        if (user) {
          const updatedUser = {
            ...user,
            bookmarks: [...user.bookmarks, {
              articleId: article.articleId,
              title: article.title,
              image: article.image,
              source: article.source,
              category: article.category,
              publishedAt: article.publishedAt,
              url: article.url,
              savedAt: new Date()
            }]
          };
          updateUser(updatedUser);
        }
        toast.success('Article bookmarked');
        if (onBookmarkChange) onBookmarkChange();
      }
    } catch (error) {
      console.error('Bookmark error:', error);
    }
  };

  const trackInteraction = async (interactionType) => {
    // Track click, share, or other interactions in backend
    if (isAuthenticated) {
      try {
        await api.post('/user/interactions', {
          articleId: article.articleId,
          title: article.title,
          content: article.content,
          description: article.description,
          category: article.category,
          source: article.source,
          interactionType: interactionType,
        });
      } catch (error) {
        console.error(`Error tracking ${interactionType}:`, error);
      }
    }
  };

  const trackShare = async () => {
    // Track share interaction in backend
    await trackInteraction('share');
  };

  const trackClick = async () => {
    // Track click interaction in backend
    await trackInteraction('click');
  };

  const handleShare = (platform) => {
    const url = encodeURIComponent(article.url);
    const title = encodeURIComponent(article.title);
    const text = encodeURIComponent(article.description || '');

    // Track the share action
    trackShare();

    let shareUrl = '';

    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${title}%20${url}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(article.url);
        toast.success('Link copied to clipboard!');
        setShowShareMenu(false);
        return;
      default:
        return;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
    setShowShareMenu(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';

    const now = Date.now();
    let diffMs = now - date.getTime();

    // If article date is in the future (diff negative), treat it as just now
    if (diffMs < 0) diffMs = 0;

    const minutes = Math.round(diffMs / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    // For older articles, show a short date
    return date.toLocaleDateString();
  };

  // Decode HTML entities safely for titles/descriptions
  const decodeHtml = (html) => {
    if (!html) return '';
    try {
      const txt = document.createElement('textarea');
      txt.innerHTML = html;
      return txt.value;
    } catch (e) {
      return String(html);
    }
  };

  const stripTags = (html) => {
    if (!html) return '';
    return decodeHtml(String(html)).replace(/<[^>]*>/g, '').trim();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {showImage && (
        <img
          src={article.image}
          alt={article.title || 'Article image'}
          className="w-full h-48 object-cover"
          onError={() => {
            // hide image if it fails to load to avoid leaving empty space
            setShowImage(false);
          }}
        />
      )}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="px-2 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 rounded">
            {article.category}
          </span>
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <FaClock className="mr-1" />
            {formatDate(article.publishedAt || article.pubDate || article.publishedAtRaw)}
          </div>
        </div>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {decodeHtml(article.title)}
        </h3>

        {/* Sentiment Badge */}
        {article.sentiment && (
          <span
            className={`inline-block mt-1 px-2 py-0.5 text-xs rounded ${
              article.sentiment === 'Positive'
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : article.sentiment === 'Negative'
                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200'
            }`}
          >
            {article.sentiment}
          </span>
        )}

        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Source: {article.source}
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleLike}
              className="flex items-center space-x-1 px-2 py-1 text-sm text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors"
            >
              {isLiked ? (
                <FaHeart className="text-red-500" />
              ) : (
                <FaRegHeart />
              )}
              <span>{likesCount}</span>
            </button>

            <button
              onClick={handleBookmark}
              className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                showRemoveButton && isBookmarked
                  ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800'
                  : 'text-gray-600 dark:text-gray-300 hover:text-yellow-500'
              }`}
            >
              {showRemoveButton && isBookmarked ? 'Remove' : <FaBookmark />}
            </button>

            <div className="relative">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors"
              >
                <FaShare />
              </button>
              {showShareMenu && (
                <div className="absolute right-0 bottom-full mb-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg z-50">
                  <button
                    onClick={() => handleShare('whatsapp')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    WhatsApp
                  </button>
                  <button
                    onClick={() => handleShare('facebook')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    Facebook
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    X (Twitter)
                  </button>
                  <button
                    onClick={() => handleShare('linkedin')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    LinkedIn
                  </button>
                  <button
                    onClick={() => handleShare('copy')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    Copy Link
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={trackClick}
          className="mt-3 inline-block text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          Read more →
        </a>
      </div>
    </div>
  );
};

export default NewsCard;

