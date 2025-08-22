import React from 'react';
import { Link } from 'react-router-dom';
import { Course } from '../types/models';
import { calculateCourseGrade } from '../utils/gradeCalculator';

interface CourseCardProps {
  course: Course;
}

const Card: React.FC<CourseCardProps> = ({ course }) => {
  const currentGrade = calculateCourseGrade(course);

  return (
    <Link to={`/course/${course.id}`} className="block">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">{course.name}</h2>
        <p className="text-gray-600 dark:text-gray-400">Credits: {course.credits}</p>
        <p className="text-gray-700 dark:text-gray-300 font-bold mt-2">
          Current Grade: {currentGrade !== null ? `${currentGrade.toFixed(2)}%` : 'N/A'}
        </p>
      </div>
    </Link>
  );
};

export default Card;
