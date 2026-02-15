/**
 * AdminPanel page for News-Mania frontend.
 * Purpose: Provides administrative interface for managing users and articles.
 * Used for content moderation and system administration.
 */

import { useState, useEffect } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { FaBan, FaCheck, FaTrash, FaUserSlash, FaUserCheck } from 'react-icons/fa';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('news');
  const [news, setNews] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalNews, setTotalNews] = useState(0);
  const [blockedNews, setBlockedNews] = useState(0);

  useEffect(() => {
    if (activeTab === 'news') {
      fetchNews();
    } else {
      fetchUsers();
    }
  }, [activeTab]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/news');
      if (response.data.success) {
        setNews(response.data.news);
        setTotalNews(response.data.total || 0);
        setBlockedNews(response.data.blocked || 0);
      }
    } catch (error) {
      toast.error('Failed to fetch news');
      console.error('Fetch news error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/users');
      if (response.data.success) {
        setUsers(response.data.users);
      }
    } catch (error) {
      toast.error('Failed to fetch users');
      console.error('Fetch users error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockNews = async (articleId) => {
    try {
      const response = await api.post(`/admin/block/${articleId}`);
      if (response.data.success) {
        toast.success('Article blocked');
        fetchNews();
      }
    } catch (error) {
      toast.error('Failed to block article');
    }
  };

  const handleUnblockNews = async (articleId) => {
    try {
      const response = await api.post(`/admin/unblock/${articleId}`);
      if (response.data.success) {
        toast.success('Article unblocked');
        fetchNews();
      }
    } catch (error) {
      toast.error('Failed to unblock article');
    }
  };

  const handleDeleteNews = async (articleId) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;

    try {
      const response = await api.delete(`/admin/delete/${articleId}`);
      if (response.data.success) {
        toast.success('Article deleted');
        fetchNews();
      }
    } catch (error) {
      toast.error('Failed to delete article');
    }
  };

  const handleBlockUser = async (userId) => {
    try {
      const response = await api.post(`/admin/user/block/${userId}`);
      if (response.data.success) {
        toast.success('User blocked');
        fetchUsers();
      }
    } catch (error) {
      toast.error('Failed to block user');
    }
  };

  const handleUnblockUser = async (userId) => {
    try {
      const response = await api.post(`/admin/user/unblock/${userId}`);
      if (response.data.success) {
        toast.success('User unblocked');
        fetchUsers();
      }
    } catch (error) {
      toast.error('Failed to unblock user');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Admin Panel</h1>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('news')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'news'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            News Management
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'users'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            User Management
          </button>
        </div>
      </div>

      {/* News Management */}
      {activeTab === 'news' && (
        <div>
          <div className="mb-4">
            <p className="text-gray-600 dark:text-gray-400">
              Total News: {totalNews} | Blocked: {blockedNews}
            </p>
          </div>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Title
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Source
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {news.map((article) => (
                    <tr key={article._id} className={article.isBlocked ? 'opacity-60' : ''}>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white max-w-xs truncate">
                        {article.title}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {article.category}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {article.source}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {article.isBlocked ? (
                          <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 dark:bg-red-900 dark:text-red-200 rounded">
                            Blocked
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 dark:bg-green-900 dark:text-green-200 rounded">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex space-x-2">
                          {article.isBlocked ? (
                            <button
                              onClick={() => handleUnblockNews(article.articleId)}
                              className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900 rounded"
                              title="Unblock"
                            >
                              <FaCheck />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleBlockNews(article.articleId)}
                              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded"
                              title="Block"
                            >
                              <FaBan />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteNews(article.articleId)}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* User Management */}
      {activeTab === 'users' && (
        <div>
          <div className="mb-4">
            <p className="text-gray-600 dark:text-gray-400">
              Total Users: {users.length} | Active: {users.filter((u) => u.isActive).length} |
              Blocked: {users.filter((u) => !u.isActive).length}
            </p>
          </div>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Username
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Role
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {users.map((user) => (
                    <tr key={user._id} className={!user.isActive ? 'opacity-60' : ''}>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                        {user.username}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {user.email}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded ${
                            user.role === 'admin'
                              ? 'text-purple-800 bg-purple-100 dark:bg-purple-900 dark:text-purple-200'
                              : 'text-blue-800 bg-blue-100 dark:bg-blue-900 dark:text-blue-200'
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {user.isActive ? (
                          <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 dark:bg-green-900 dark:text-green-200 rounded">
                            Active
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 dark:bg-red-900 dark:text-red-200 rounded">
                            Blocked
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {user.isActive ? (
                          <button
                            onClick={() => handleBlockUser(user._id)}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded"
                            title="Block User"
                          >
                            <FaUserSlash />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUnblockUser(user._id)}
                            className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900 rounded"
                            title="Unblock User"
                          >
                            <FaUserCheck />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;

