import { useState, useEffect } from 'react';
import './App.css';
import { CourseProvider } from './contexts/CourseContext';
import StorageAlert from './components/StorageAlert';
import CourseManager from './components/CourseManager';
import GradeForm from './components/GradeForm';
import GradeSummary from './components/GradeSummary';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  // Initialize dark mode from localStorage or system preference
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
      setDarkMode(savedDarkMode === 'true');
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
    }
  }, []);

  // Save dark mode preference to localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());

    // Apply dark mode to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <CourseProvider>
      <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
        <div className="container mx-auto px-4 py-8">
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-primary">GradeCompass</h1>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-md bg-gray-200 dark:bg-gray-700"
              aria-label="Toggle dark mode"
            >
              {darkMode ? '🌞' : '🌙'}
            </button>
          </header>
          <StorageAlert />
          <main>
            <CourseManager />
            <GradeSummary />
            <GradeForm />
          </main>
          <footer className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700 text-center text-gray-500 dark:text-gray-400 text-sm">
            <p>GradeCompass &copy; {new Date().getFullYear()}</p>
          </footer>
        </div>
      </div>
    </CourseProvider>
  );
}

export default App;