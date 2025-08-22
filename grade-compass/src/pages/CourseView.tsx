import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useCourses } from '../contexts/CourseContext';
import { calculateCourseGrade, calculateRemainingWeight } from '../utils/gradeCalculator';
import useGradeAnalysis from '../hooks/useGradeAnalysis';

const CourseView: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { courses, deleteCourse, addAssessment, updateAssessment, deleteAssessment } = useCourses();
  const [newAssessmentName, setNewAssessmentName] = useState('');
  const [newAssessmentWeight, setNewAssessmentWeight] = useState<number | ''>(0);
  const [targetGrade, setTargetGrade] = useState<number | ''>(0);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const course = courses.find((c) => c.id === courseId);

  const { currentGrade, remainingWeight, gradeNeededForTarget } = useGradeAnalysis(course);

  if (!course) {
    return (
      <Layout>
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold text-red-500">Course Not Found</h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Go to Dashboard
          </button>
        </div>
      </Layout>
    );
  }

  const handleDeleteCourse = () => {
    if (window.confirm(`Are you sure you want to delete the course "${course.name}"?`)) {
      deleteCourse(course.id);
      navigate('/dashboard');
    }
  };

  const handleDeleteAssessment = (assessmentId: string) => {
    if (window.confirm('Are you sure you want to delete this assessment?')) {
      deleteAssessment(course.id, assessmentId);
    }
  };

  const handleAddAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAssessmentName.trim() && newAssessmentWeight !== '' && newAssessmentWeight > 0) {
      addAssessment(course.id, newAssessmentName.trim(), newAssessmentWeight);
      setNewAssessmentName('');
      setNewAssessmentWeight(0);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000); // Hide after 3 seconds
    } else {
      alert('Please enter a valid assessment name and positive weight.');
    }
  };

  const handleGradeChange = (assessmentId: string, grade: number | '' | null) => {
    updateAssessment(course.id, assessmentId, { grade: grade === '' ? null : grade });
  };

  const neededGrade = targetGrade !== '' && remainingWeight > 0
    ? gradeNeededForTarget(targetGrade)
    : null;

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{course.name} ({course.credits} Credits)</h1>
        <button
          onClick={handleDeleteCourse}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Delete Course
        </button>
      </div>

      {showSuccessMessage && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6" role="alert">
          <p className="font-bold">Success!</p>
          <p>Assessment added successfully.</p>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Assessments</h2>
        {course.assessments.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">No assessments added yet.</p>
            <p className="text-gray-500 dark:text-gray-500">Use the form below to add your first assessment!</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {course.assessments.map((assessment) => (
              <li key={assessment.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-gray-100 dark:bg-gray-700 rounded-md shadow-sm">
                <div className="mb-2 md:mb-0">
                  <p className="font-medium text-gray-800 dark:text-gray-100">{assessment.name} (<span className="font-bold">{assessment.weight}%</span>)</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Grade: {assessment.grade !== null ? assessment.grade : 'N/A'}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    className="w-24 shadow appearance-none border rounded py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-gray-50 dark:bg-gray-600 transition duration-150 ease-in-out"
                    placeholder="Grade"
                    value={assessment.grade !== null ? assessment.grade : ''}
                    onChange={(e) => handleGradeChange(assessment.id, parseFloat(e.target.value))}
                    min="0"
                    max="100"
                  />
                  <button
                    onClick={() => handleDeleteAssessment(assessment.id)}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded text-sm transition duration-150 ease-in-out"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Add New Assessment</h2>
        <form onSubmit={handleAddAssessment} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label htmlFor="assessmentName" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Assessment Name</label>
            <input
              type="text"
              id="assessmentName"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-gray-100 dark:bg-gray-700"
              value={newAssessmentName}
              onChange={(e) => setNewAssessmentName(e.target.value)}
              placeholder="e.g., Midterm"
              required
            />
          </div>
          <div>
            <label htmlFor="assessmentWeight" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Weight (%)</label>
            <input
              type="number"
              id="assessmentWeight"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-gray-100 dark:bg-gray-700"
              value={newAssessmentWeight}
              onChange={(e) => setNewAssessmentWeight(parseFloat(e.target.value))}
              placeholder="e.g., 40"
              min="1"
              max="100"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
          >
            Add Assessment
          </button>
        </form>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Grade Summary</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Current Grade: {currentGrade !== null ? currentGrade.toFixed(2) + '%' : 'N/A'}
        </p>
        <p className="text-gray-600 dark:text-gray-300">
          Remaining Weight: {remainingWeight.toFixed(2)}%
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Target Grade Predictor</h2>
        <div className="flex items-center space-x-4 mb-4">
          <label htmlFor="targetGrade" className="block text-gray-700 dark:text-gray-300 text-sm font-bold">Target Grade (%):</label>
          <input
            type="number"
            id="targetGrade"
            className="w-24 shadow appearance-none border rounded py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-gray-100 dark:bg-gray-700"
            value={targetGrade}
            onChange={(e) => setTargetGrade(parseFloat(e.target.value))}
            min="0"
            max="100"
            placeholder="e.g., 85"
          />
        </div>
        {targetGrade !== '' && remainingWeight > 0 && (
          <p className="text-gray-600 dark:text-gray-300">
            Grade needed on remaining assessments to achieve {targetGrade}%: {' '}
            {neededGrade !== null ? (
              neededGrade.toFixed(2) + '%'
            ) : (
              'N/A (Insufficient data or remaining weight)'
            )}
          </p>
        )}
        {remainingWeight === 0 && (
          <p className="text-gray-600 dark:text-gray-300">
            No remaining assessments to influence grade.
          </p>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Assessment Grades Chart</h2>
        {course.assessments.filter(a => a.grade !== null).length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No graded assessments to display chart.</p>
        ) : (
          <div className="flex items-end h-48 border-b border-l border-gray-300 dark:border-gray-600 pt-4">
            {course.assessments.filter(a => a.grade !== null).map((assessment) => (
              <div key={assessment.id} className="flex flex-col items-center mx-2">
                <div
                  className="bg-blue-500 w-8 rounded-t-md"
                  style={{ height: `${assessment.grade || 0}%` }}
                  title={`${assessment.name}: ${assessment.grade}%`}
                ></div>
                <span className="text-xs text-gray-600 dark:text-gray-400 mt-1">{assessment.name.substring(0, 5)}...</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CourseView;