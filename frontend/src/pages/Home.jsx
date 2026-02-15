/**
 * Home page for News-Mania frontend.
 * Purpose: Main landing page displaying latest news with infinite scroll.
 * Used as the primary news feed interface.
 */

import { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import NewsCard from '../components/NewsCard';
import NewsCardSkeleton from '../components/NewsCardSkeleton';
import { toast } from 'react-toastify';

const Home = () => {
  const { user } = useAuth();
  const [articles, setArticles] = useState([]);
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [mode, setMode] = useState('default');

  useEffect(() => {
    // Trending will be fetched based on mode in the second useEffect
  }, []);

  useEffect(() => {
    if (user?.preferences?.personalizedMode && user?.preferences?.categories?.length > 0) {
      console.log('🔄 Switching to personalized mode');
      setMode('personalized');
      setArticles([]); // Clear articles before fetching personalized
      fetchPersonalizedNews();
      fetchPersonalizedTrending();
      fetchAIRecommendations();
    } else {
      console.log('🔄 Switching to default mode');
      setMode('default');
      setPage(1);
      setArticles([]);
      setAiRecommendations([]);
      fetchNews(1);
      fetchTrending();
    }
  }, [user?.preferences?.personalizedMode, user?.preferences?.categories]);

  // Filter AI recommendations to exclude articles already shown in manual personalization
  useEffect(() => {
    if (articles.length > 0 && aiRecommendations.length > 0) {
      const manualArticleIds = new Set(
        articles.map(a => a.articleId || a.url || a.link)
      );
      
      const filteredAiArticles = aiRecommendations.filter(a => 
        !manualArticleIds.has(a.articleId || a.url || a.link)
      );
      
      if (filteredAiArticles.length !== aiRecommendations.length) {
        console.log(`📌 Filtered AI recommendations: ${filteredAiArticles.length} (removed ${aiRecommendations.length - filteredAiArticles.length} duplicates)`);
        setAiRecommendations(filteredAiArticles);
      }
    }
  }, [articles]);

  const fetchTrending = async () => {
    try {
      const response = await api.get(`/news/top?page=1&_t=${Date.now()}`);
      if (response.data.success && response.data.trending) {
        setTrending(response.data.trending);
      }
    } catch (error) {
      console.error('Error fetching trending:', error);
    }
  };

  const fetchPersonalizedTrending = async () => {
    try {
      const categories = user?.preferences?.categories || [];
      if (categories.length === 0) {
        setTrending([]);
        return;
      }

      // Fetch trending from all selected categories
      const responses = await Promise.allSettled(
        categories.map((category) =>
          api.get(`/news/category/${encodeURIComponent(category)}?page=1&_t=${Date.now()}`)
            .then((res) => res.data.articles?.slice(0, 2) || [])
        )
      );

      const trendingArticles = [];
      responses.forEach((result) => {
        if (result.status === 'fulfilled' && result.value) {
          trendingArticles.push(...result.value);
        }
      });

      // Get top 5 trending from personalized categories
      const uniqueTrending = Array.from(
        new Map(trendingArticles.map((article) => [article.articleId || article.url || article.link, article])).values()
      ).slice(0, 5);

      setTrending(uniqueTrending);
    } catch (error) {
      console.error('Error fetching personalized trending:', error);
    }
  };

  const fetchNews = async (pageNum = 1) => {
    try {
      setLoading(true);
      const response = await api.get(`/news/top?page=${pageNum}&_t=${Date.now()}`);
      if (response.data.success) {
        // MANDATORY DEBUG: Log received summaries
        if (response.data.articles && response.data.articles.length > 0) {
          console.log(`✅ SUMMARY RECEIVED: "${response.data.articles[0].summary || 'MISSING'}"`, {
            totalArticles: response.data.articles.length,
            firstArticleTitle: response.data.articles[0].title,
            firstArticleSummary: response.data.articles[0].summary,
            firstArticleHasDescription: !!response.data.articles[0].description
          });
        }
        setArticles(response.data.articles);
        setHasMore(false); // For now, no pagination
      }
    } catch (error) {
      toast.error('Unable to fetch news. Please try again later.');
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPersonalizedNews = async () => {
    try {
      setLoading(true);
      const categories = user?.preferences?.categories || [];
      
      console.log('📋 Categories to fetch (manual personalization):', categories);
      
      if (categories.length === 0) {
        toast.info('No categories selected. Please select categories in your profile settings.');
        console.log('⚠️  No categories found in user preferences');
        setArticles([]);
        setLoading(false);
        return;
      }

      console.log('🔍 Fetching manual personalization (category-based)');
      const allArticles = [];
      const categoryResults = {};
      
      // Fetch all categories in parallel
      const responses = await Promise.allSettled(
        categories.map((category) =>
          api.get(`/news/category/${encodeURIComponent(category)}?page=1&_t=${Date.now()}`)
            .then((res) => ({
              category,
              data: res.data
            }))
        )
      );

      responses.forEach((result, index) => {
        const category = categories[index];
        if (result.status === 'fulfilled') {
          const data = result.value?.data;
          const articles = data?.articles || [];
          categoryResults[category] = articles.length;
          console.log(`✅ ${category}: ${articles.length} articles`);
          
          if (articles.length > 0) {
            allArticles.push(...articles);
          }
        } else {
          categoryResults[category] = 0;
          console.error(`❌ Error fetching ${category}:`, result.reason?.message || result.reason);
        }
      });

      console.log('📊 Manual personalization by category:', categoryResults);
      console.log(`📦 Total articles collected: ${allArticles.length}`);

      if (allArticles.length === 0) {
        toast.warning('No news found for your selected categories. Try different selections.');
        console.log('⚠️  No articles found after category fetches');
        setArticles([]);
        setLoading(false);
        return;
      }

      // Remove duplicates and sort by date
      const uniqueArticles = Array.from(
        new Map(allArticles.map((article) => [article.articleId || article.url || article.link, article])).values()
      ).sort((a, b) => new Date(b.publishedAt || b.pubDate) - new Date(a.publishedAt || a.pubDate));

      console.log(`✨ Total unique articles from ${categories.length} categories: ${uniqueArticles.length}`);
      setArticles(uniqueArticles);
    } catch (error) {
      toast.error('Unable to fetch news. Please try again later.');
      console.error('Error fetching personalized news:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAIRecommendations = async () => {
    try {
      setAiLoading(true);
      console.log('🤖 Fetching AI-based recommendations');
      
      // Call the /news/personalized endpoint which uses AI ranking
      const response = await api.get(`/news/personalized?page=1&limit=6&_t=${Date.now()}`);
      
      if (response.data.success && response.data.articles) {
        const aiArticles = response.data.articles;
        console.log(`✅ AI Recommendations: ${aiArticles.length} articles`);
        console.log(`🤖 AI Ranking Applied: ${response.data.personalized ? 'YES' : 'NO'}`);
        
        // Note: We'll filter out duplicates in a separate useEffect after articles are loaded
        // For now, store all AI recommendations
        setAiRecommendations(aiArticles);
      } else {
        console.log('ℹ️ No AI recommendations available');
        setAiRecommendations([]);
      }
    } catch (error) {
      console.error('Error fetching AI recommendations:', error);
      setAiRecommendations([]);
    } finally {
      setAiLoading(false);
    }
  };

  const loadMore = () => {
    if (mode === 'default') {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchNews(nextPage);
    }
  };

  const toggleMode = () => {
    if (mode === 'default') {
      if (!user) {
        toast.error('Please login to use personalized mode');
        return;
      }
      if (!user.preferences?.personalizedMode) {
        toast.warning('Please enable Personalized Mode in your Profile first');
        return;
      }
      if (!user.preferences?.categories || user.preferences.categories.length === 0) {
        toast.info('Please select categories in your profile settings first');
        return;
      }
      console.log('🔄 User requesting personalized mode with categories:', user.preferences.categories);
      setMode('personalized');
      setArticles([]);
      fetchPersonalizedNews();
      fetchPersonalizedTrending();
    } else {
      console.log('🔄 User requesting default mode');
      setMode('default');
      setPage(1);
      setArticles([]);
      fetchNews(1);
      fetchTrending();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Mode Toggle */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {mode === 'personalized' ? 'Personalized News' : 'Top Headlines'}
        </h1>
        <button
          onClick={toggleMode}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {mode === 'personalized' ? 'Switch to Default' : 'Switch to Personalized'}
        </button>
      </div>

      {/* Trending Section */}
      {trending.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            🔥 Trending Now
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trending.map((article) => (
              <NewsCard key={article.articleId} article={article} />
            ))}
          </div>
        </div>
      )}

      {/* News Grid */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {mode === 'personalized' ? 'Your Interests' : 'Latest News'}
        </h2>
        {loading && articles.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <NewsCardSkeleton key={i} />
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              No news available based on your selected interests.
            </p>
          </div>
        ) : (
          <InfiniteScroll
            dataLength={articles.length}
            next={loadMore}
            hasMore={hasMore && mode === 'default'}
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

      {/* AI Recommendations Section - Only show in personalized mode if recommendations exist */}
      {mode === 'personalized' && aiRecommendations.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            You may also be interested in
          </h2>
          {aiLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <NewsCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aiRecommendations.map((article) => (
                <NewsCard key={article.articleId} article={article} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;

