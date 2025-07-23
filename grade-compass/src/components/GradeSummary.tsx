import React, { useState } from 'react';
import { useCourses } from '../contexts/CourseContext';
import { useGradeAnalysis } from '../hooks/useGradeAnalysis';
import { formatPercentage } from '../utils/helpers';
import { validateTargetGrade } from '../utils/validation';
import { GRADE_PRESETS } from '../constants';

/**
 * Component for displaying grade summary and predictions
 */
const GradeSummary: React.FC = () => {
  const { activeCourse, updateCourse } = useCourses();
  
  const [targetGradeInput, setTargetGradeInput] = useState('');
  const [targetGradeError, setTargetGradeError] = useState<string | null>(null);
  
  // If no active course, show placeholder
  if (!activeCourse) {
    return (
      <div className="card mb-6">
        <p className="text-gray-500 dark:text-gray-400">
          Please select or create a course to see grade summary.
        </p>
      </div>
    );
  }
  
  const { components, targetGrade } = activeCourse;
  
  // Use our custom hook for grade analysis
  const { 
    currentGrade, 
    completedWeight, 
    remainingWeight, 
    isComplete,
    requiredAverage, 
    isAchievable, 
    recommendations,
    letterGrade
  } = useGradeAnalysis(components, targetGrade);
  
  // Handle target grade change
  const handleTargetGradeChange = (value: string) => {
    setTargetGradeInput(value);
    
    const error = validateTargetGrade(value);
    setTargetGradeError(error);
    
    if (!error) {
      updateCourse({
        ...activeCourse,
        targetGrade: parseFloat(value),
      });
    }
  };
  
  // Handle preset grade selection
  const handlePresetSelect = (value: number) => {
    setTargetGradeInput(value.toString());
    setTargetGradeError(null);
    
    updateCourse({
      ...activeCourse,
      targetGrade: value,
    });
  };
  
  return (
    <>
      <div className="card mb-6">
        <h2 className="text-xl font-semibold mb-4">Grade Summary</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Current Status</h3>
            
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Current Grade</div>
                <div className="text-3xl font-bold">
                  {currentGrade !== null ? formatPercentage(currentGrade) : 'No grades yet'}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Completed</div>
                <div className="text-xl">
                  {formatPercentage(completedWeight)} of course weight
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Remaining</div>
                <div className="text-xl">
                  {formatPercentage(remainingWeight)} of course weight
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Target Grade</h3>
            
            <div className="mb-4">
              <label htmlFor="target-grade" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Set Target Grade (%)
              </label>
              <input
                id="target-grade"
                type="number"
                min="0"
                max="100"
                value={targetGradeInput || targetGrade}
                onChange={(e) => handleTargetGradeChange(e.target.value)}
                className={`input w-full ${targetGradeError ? 'border-red-500' : ''}`}
              />
              {targetGradeError && (
                <p className="text-red-500 text-sm mt-1">{targetGradeError}</p>
              )}
            </div>
            
            <div className="mb-4">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Common Targets</div>
              <div className="flex flex-wrap gap-2">
                {GRADE_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => handlePresetSelect(preset.value)}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      targetGrade === preset.value
                        ? 'bg-primary text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    {preset.label} ({preset.value}%)
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Required Average on Remaining Work</div>
              <div
                className={`text-2xl font-bold ${
                  isAchievable
                    ? requiredAverage && requiredAverage > 90
                      ? 'text-yellow-500'
                      : 'text-green-500'
                    : 'text-red-500'
                }`}
              >
                {isComplete
                  ? 'All components completed'
                  : requiredAverage !== null
                  ? isAchievable
                    ? formatPercentage(requiredAverage)
                    : 'Not achievable'
                  : 'N/A'}
              </div>
            </div>
          </div>
        </div>
        
        {recommendations.length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-2">Recommendations</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
              {recommendations.map((recommendation, index) => (
                <li key={index}>{recommendation}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      {/* Grade breakdown chart would go here */}
      <div className="card mb-6">
        <h2 className="text-xl font-semibold mb-4">Grade Breakdown</h2>
        <div className="h-64 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">
            Grade breakdown visualization
          </p>
        </div>
      </div>
    </>
  );
};

export default GradeSummary;