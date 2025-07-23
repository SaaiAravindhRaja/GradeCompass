import React from 'react';
import { useCourses } from '../contexts/CourseContext';

/**
 * Component to display a warning when localStorage is unavailable
 */
const StorageAlert: React.FC = () => {
  const { isStorageAvailable } = useCourses();

  if (isStorageAvailable) {
    return null;
  }

  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6" role="alert">
      <div className="flex">
        <div className="py-1">
          <svg
            className="h-6 w-6 text-yellow-500 mr-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <div>
          <p className="font-bold">Storage Unavailable</p>
          <p className="text-sm">
            Local storage is not available in your browser. Your data will not be saved between sessions.
            This could be due to private browsing mode, browser settings, or storage quota limitations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StorageAlert;