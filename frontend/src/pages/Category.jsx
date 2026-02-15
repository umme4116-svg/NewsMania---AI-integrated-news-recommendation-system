/**
 * Category page for News-Mania frontend.
 * Purpose: Displays news articles filtered by category (e.g., politics, sports).
 * Used for categorized news browsing.
 */

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import api from '../utils/api';
import NewsCard from '../components/NewsCard';
import NewsCardSkeleton from '../components/NewsCardSkeleton';
import { toast } from 'react-toastify';

const Category = () => {
  const { name } = useParams();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setPage(1);
    setArticles([]);
    fetchCategoryNews(1);
  }, [name]);

  const fetchCategoryNews = async (pageNum = 1) => {
    try {
      setLoading(true);
      const decodedName = name ? decodeURIComponent(name) : '';
      console.log('📂 Fetching category:', decodedName);
      // Use /news/category endpoint (integrated with multi-API rotation and RSS as primary)
      const response = await api.get(`/news/category/${encodeURIComponent(decodedName)}?page=${pageNum}&limit=20`);
      console.log('📂 Response:', response.data);
      
      if (response.data.articles) {
        console.log(`📂 Got ${response.data.articles.length} articles for ${decodedName}`);
        if (pageNum === 1) {
          setArticles(response.data.articles || []);
        } else {
          setArticles((prev) => [...prev, ...(response.data.articles || [])]);
        }
        setHasMore((response.data.articles || []).length > 0);
      } else {
        setArticles([]);
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching category news:', error);
      setArticles([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchCategoryNews(nextPage);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        {decodeURIComponent(name)}
      </h1>

      {loading && articles.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <NewsCardSkeleton key={i} />
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            No news available for this category.
          </p>
        </div>
      ) : (
        <InfiniteScroll
          dataLength={articles.length}
          next={loadMore}
          hasMore={hasMore}
          loader={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {[...Array(3)].map((_, i) => (
                <NewsCardSkeleton key={i} />
              ))}
            </div>
          }
          endMessage={
            <p className="text-center text-gray-600 dark:text-gray-400 py-4">
              No more articles to load
            </p>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <NewsCard key={article.articleId} article={article} />
            ))}
          </div>
        </InfiniteScroll>
      )}
    </div>
  );
};

export default Category;

