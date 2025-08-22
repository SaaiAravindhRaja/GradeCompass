import React from 'react';
import { Course } from '../types/models';
import { calculateCourseGrade } from '../utils/gradeCalculator';

interface GradeChartProps {
  courses: Course[];
}

/**
 * Component for displaying a summary of course grades
 */
const GradeChart: React.FC<GradeChartProps> = ({ courses }) => {
  if (courses.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">
          No courses to display grades for.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Course Grades Overview</h2>
      <ul className="space-y-2">
        {courses.map((course) => {
          const grade = calculateCourseGrade(course);
          return (
            <li key={course.id} className="flex justify-between items-center text-gray-700 dark:text-gray-300">
              <span className="font-medium">{course.name} ({course.code})</span>
              <span className="text-lg font-bold">
                {grade !== null ? `${grade.toFixed(2)}%` : 'N/A'}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default GradeChart;