/**
 * NewsCardSkeleton component for News-Mania frontend.
 * Purpose: Provides a loading placeholder that mimics the NewsCard layout.
 * Used for better user experience during data fetching.
 */

const NewsCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="w-full h-48 bg-gray-300 dark:bg-gray-700"></div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="h-5 w-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
        <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
        <div className="flex items-center justify-between">
          <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="flex space-x-2">
            <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsCardSkeleton;

