import React from 'react';
import { Course } from '../types/models';
import { calculateCourseGrade } from '../utils/gradeCalculator';

interface GradeSummaryProps {
  courses: Course[];
}

/**
 * Component for displaying overall grade summary across all courses
 */
const GradeSummary: React.FC<GradeSummaryProps> = ({ courses }) => {
  if (courses.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">
          No courses to summarize.
        </p>
      </div>
    );
  }

  let totalCredits = 0;
  let totalWeightedGradePoints = 0;
  let coursesWithGrades = 0;

  courses.forEach(course => {
    const courseGrade = calculateCourseGrade(course);
    if (courseGrade !== null) {
      totalCredits += course.credits;
      totalWeightedGradePoints += (courseGrade / 100) * course.credits;
      coursesWithGrades++;
    }
  });

  const overallAverage = totalCredits > 0 ? (totalWeightedGradePoints / totalCredits) * 100 : null;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Overall Grade Summary</h2>
      <div className="space-y-4">
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Total Courses</div>
          <div className="text-3xl font-bold text-gray-800 dark:text-gray-100">{courses.length}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Total Credits (Graded)</div>
          <div className="text-3xl font-bold text-gray-800 dark:text-gray-100">{totalCredits}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Overall Average Grade</div>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {overallAverage !== null ? `${overallAverage.toFixed(2)}%` : 'N/A'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradeSummary;