import React, { ReactNode, useState } from 'react';
import StorageAlert from './StorageAlert';

interface LayoutProps {
  children: ReactNode;
}

/**
 * Main layout component with header and theme toggle
 */
const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary">GradeCompass</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-md bg-gray-200 dark:bg-gray-700"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? '🌞' : '🌙'}
          </button>
        </header>
        <StorageAlert />
        <main>
          {children}
        </main>
        <footer className="mt-12 py-4 text-center text-gray-500 text-sm">
          <p>GradeCompass &copy; {new Date().getFullYear()}</p>
        </footer>
      </div>
    </div>
  );
};

export default Layout;