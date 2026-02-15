/**
 * Profile page for News-Mania frontend.
 * Purpose: Displays and allows editing of user profile information.
 * Used for user account management and personalization.
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { toast } from 'react-toastify';

const categories = [
  'Top Headlines',
  'Politics',
  'Technology',
  'Sports',
  'Business',
  'Health',
  'Entertainment',
  'International News',
];

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [personalizedMode, setPersonalizedMode] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.preferences) {
      setSelectedCategories(user.preferences.categories || []);
      setPersonalizedMode(user.preferences.personalizedMode || false);
    }
  }, [user]);

  const handleCategoryToggle = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleSavePreferences = async () => {
    try {
      setLoading(true);
      const response = await api.post('/user/preferences', {
        categories: selectedCategories,
        personalizedMode,
      });

      if (response.data.success) {
        const updatedUser = { ...user, preferences: response.data.preferences };
        updateUser(updatedUser);
        console.log('✅ Preferences saved and user updated:', updatedUser.preferences);
        toast.success('Preferences saved successfully!');
      }
    } catch (error) {
      toast.error('Failed to save preferences');
      console.error('Save preferences error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Profile Settings</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          User Information
        </h2>
        <div className="space-y-2">
          <p className="text-gray-600 dark:text-gray-400">
            <span className="font-medium">Username:</span> {user?.username}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            <span className="font-medium">Email:</span> {user?.email}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            <span className="font-medium">Role:</span>{' '}
            <span className="capitalize">{user?.role}</span>
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          News Preferences
        </h2>

        <div className="mb-6">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={personalizedMode}
              onChange={(e) => setPersonalizedMode(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-gray-700 dark:text-gray-300">
              Enable Personalized Mode
            </span>
          </label>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 ml-6">
            When enabled, only news from your selected categories will be shown
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
            Select Categories
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {categories.map((category) => (
              <label
                key={category}
                className="flex items-center space-x-2 p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryToggle(category)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">{category}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={handleSavePreferences}
          disabled={loading}
          className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>
    </div>
  );
};

export default Profile;

