import React from 'react';
import Layout from '../components/Layout';

const SettingsPage: React.FC = () => {
  return (
    <Layout>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Settings</h1>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <p className="text-gray-600 dark:text-gray-300">Settings options will go here.</p>
        {/* Example setting: Toggle dark mode (already in Layout, but could be controlled here) */}
      </div>
    </Layout>
  );
};

export default SettingsPage;
