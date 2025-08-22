import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';

const SettingsPage: React.FC = () => {
  const { logout } = useAuth();
  const [userName, setUserName] = useState('John Doe'); // Mock user name
  const [userEmail, setUserEmail] = useState('john.doe@example.com'); // Mock user email

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Profile saved! (Mock action)');
    // In a real app, you'd send this to a backend
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Settings</h1>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">User Profile</h2>
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label htmlFor="userName" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Name</label>
            <input
              type="text"
              id="userName"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-gray-100 dark:bg-gray-700"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="userEmail" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              id="userEmail"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-gray-100 dark:bg-gray-700"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
          >
            Save Profile
          </button>
        </form>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">About GradeCompass</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          GradeCompass is a simple application to help students track their courses, assessments, and grades.
          It provides an overview of your academic progress and helps predict grades.
        </p>
        <p className="text-gray-600 dark:text-gray-300">
          Version: 1.0.0 (Frontend Only)
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Account Actions</h2>
        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
        >
          Logout
        </button>
      </div>
    </Layout>
  );
};

export default SettingsPage;
