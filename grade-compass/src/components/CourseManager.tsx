import React, { useState } from 'react';
import { useCourses } from '../contexts/CourseContext';

/**
 * Component for managing courses (selection, creation, deletion)
 */
const CourseManager: React.FC = () => {
  const {
    courses,
    activeCourseId,
    setActiveCourseId,
    addCourse,
    deleteCourse,
  } = useCourses();
  
  const [newCourseName, setNewCourseName] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCourseName.trim()) {
      addCourse(newCourseName.trim());
      setNewCourseName('');
    }
  };
  
  const handleDeleteCourse = () => {
    if (activeCourseId) {
      deleteCourse(activeCourseId);
      setShowDeleteConfirm(false);
    }
  };
  
  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
        <div className="mb-4 md:mb-0">
          <label htmlFor="course-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Select Course
          </label>
          <select
            id="course-select"
            value={activeCourseId || ''}
            onChange={(e) => setActiveCourseId(e.target.value || null)}
            className="input bg-white dark:bg-gray-800"
            disabled={courses.length === 0}
          >
            {courses.length === 0 ? (
              <option value="">No courses available</option>
            ) : (
              courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))
            )}
          </select>
        </div>
        
        <div className="flex space-x-2">
          {activeCourseId && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="btn bg-red-500 text-white hover:bg-red-600 focus:ring-red-500"
              aria-label="Delete course"
            >
              Delete Course
            </button>
          )}
        </div>
      </div>
      
      <form onSubmit={handleAddCourse} className="flex items-end space-x-2">
        <div className="flex-grow">
          <label htmlFor="new-course-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Add New Course
          </label>
          <input
            id="new-course-name"
            type="text"
            value={newCourseName}
            onChange={(e) => setNewCourseName(e.target.value)}
            placeholder="Enter course name"
            className="input bg-white dark:bg-gray-800"
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!newCourseName.trim()}
        >
          Add Course
        </button>
      </form>
      
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-6">
              Are you sure you want to delete this course? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCourse}
                className="btn bg-red-500 text-white hover:bg-red-600 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManager;