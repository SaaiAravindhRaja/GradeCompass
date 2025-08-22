import React from 'react';
import { Link } from 'react-router-dom';
import { Course } from '../types/models';

interface CourseCardProps {
  course: Course;
}

const Card: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <Link to={`/course/${course.id}`} className="block">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">{course.name}</h2>
        <p className="text-gray-600 dark:text-gray-400">Credits: {course.credits}</p>
        {/* Future: Display current grade summary here */}
      </div>
    </Link>
  );
};

export default Card;
