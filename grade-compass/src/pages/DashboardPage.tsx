import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useCourses } from '../contexts/CourseContext';
import Card from '../components/Card';

const DashboardPage: React.FC = () => {
  const { courses, addCourse } = useCourses();
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseCredits, setNewCourseCredits] = useState<number | ''>(0);

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCourseName.trim() && newCourseCredits !== '' && newCourseCredits > 0) {
      addCourse(newCourseName.trim(), newCourseCredits);
      setNewCourseName('');
      setNewCourseCredits(0);
    } else {
      alert('Please enter a valid course name and positive credits.');
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Courses</h1>

      <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Add New Course</h2>
        <form onSubmit={handleAddCourse} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label htmlFor="courseName" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Course Name</label>
            <input
              type="text"
              id="courseName"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-gray-100 dark:bg-gray-700"
              value={newCourseName}
              onChange={(e) => setNewCourseName(e.target.value)}
              placeholder="e.g., Calculus I"
              required
            />
          </div>
          <div>
            <label htmlFor="courseCredits" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Credits</label>
            <input
              type="number"
              id="courseCredits"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-gray-100 dark:bg-gray-700"
              value={newCourseCredits}
              onChange={(e) => setNewCourseCredits(parseFloat(e.target.value))}
              placeholder="e.g., 3"
              min="1"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Add Course
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No courses added yet. Use the form above to add your first course!</p>
        ) : (
          courses.map((course) => (
            <Card key={course.id} course={course} />
          ))
        )}
      </div>
    </Layout>
  );
};

export default DashboardPage;