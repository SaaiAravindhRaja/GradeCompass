import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useCourses } from '../contexts/CourseContext';
import Card from '../components/Card';
import GradeChart from '../components/GradeChart';
import GradeSummary from '../components/GradeSummary';

const DashboardPage: React.FC = () => {
  const { courses, addCourse } = useCourses();
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseCredits, setNewCourseCredits] = useState<number | ''>(0);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCourseName.trim() && newCourseCredits !== '' && newCourseCredits > 0) {
      addCourse(newCourseName.trim(), newCourseCredits);
      setNewCourseName('');
      setNewCourseCredits(0);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000); // Hide after 3 seconds
    } else {
      alert('Please enter a valid course name and positive credits.');
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Courses</h1>

      {showSuccessMessage && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6" role="alert">
          <p className="font-bold">Success!</p>
          <p>Course added successfully.</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <GradeSummary courses={courses} />
        <GradeChart courses={courses} />
      </div>

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
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
          >
            Add Course
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">No courses added yet.</p>
            <p className="text-gray-500 dark:text-gray-500">Use the form above to add your first course and start tracking your grades!</p>
          </div>
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