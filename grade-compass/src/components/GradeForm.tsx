import React, { useState } from 'react';
import type { GradeComponent } from '../types/models';
import { useCourses } from '../contexts/CourseContext';
import { validateComponentName, validateWeight, validateScore } from '../utils/validation';
import { DEFAULTS } from '../constants';

/**
 * Component for inputting and managing grade components
 */
const GradeForm: React.FC = () => {
  const { activeCourse, addComponent, updateComponent, deleteComponent } = useCourses();
  
  const [newComponentName, setNewComponentName] = useState('');
  const [newComponentWeight, setNewComponentWeight] = useState(DEFAULTS.COMPONENT_WEIGHT.toString());
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleAddComponent = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    const nameError = validateComponentName(newComponentName);
    const weightError = validateWeight(newComponentWeight);
    
    if (nameError || weightError) {
      setErrors({
        ...(nameError ? { name: nameError } : {}),
        ...(weightError ? { weight: weightError } : {}),
      });
      return;
    }
    
    // Clear errors
    setErrors({});
    
    // Add component
    addComponent(newComponentName, parseFloat(newComponentWeight));
    
    // Reset form
    setNewComponentName('');
    setNewComponentWeight(DEFAULTS.COMPONENT_WEIGHT.toString());
  };
  
  const handleScoreChange = (component: GradeComponent, scoreValue: string) => {
    const score = scoreValue === '' ? null : parseFloat(scoreValue);
    const isCompleted = score !== null;
    
    updateComponent(component.id, {
      score,
      isCompleted,
    });
  };
  
  const handleWeightChange = (component: GradeComponent, weightValue: string) => {
    const weight = parseFloat(weightValue);
    
    if (!isNaN(weight)) {
      updateComponent(component.id, { weight });
    }
  };
  
  const handleDeleteComponent = (componentId: string) => {
    deleteComponent(componentId);
  };
  
  if (!activeCourse) {
    return (
      <div className="card mb-6">
        <p className="text-gray-500 dark:text-gray-400">
          Please select or create a course to add grade components.
        </p>
      </div>
    );
  }
  
  const totalWeight = activeCourse.components.reduce(
    (sum, component) => sum + component.weight,
    0
  );
  
  return (
    <div className="card mb-6">
      <h2 className="text-xl font-semibold mb-4">Grade Components</h2>
      
      {activeCourse.components.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          No grade components added yet. Add your first component below.
        </p>
      ) : (
        <div className="mb-4">
          <div className="grid grid-cols-12 gap-2 font-medium text-sm mb-2 px-2">
            <div className="col-span-4">Component</div>
            <div className="col-span-2">Weight (%)</div>
            <div className="col-span-3">Score</div>
            <div className="col-span-3">Actions</div>
          </div>
          
          {activeCourse.components.map((component) => (
            <div
              key={component.id}
              className="grid grid-cols-12 gap-2 items-center py-2 border-b border-gray-200 dark:border-gray-700"
            >
              <div className="col-span-4">
                <span className="font-medium">{component.name}</span>
              </div>
              
              <div className="col-span-2">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={component.weight}
                  onChange={(e) => handleWeightChange(component, e.target.value)}
                  className="input py-1 px-2 text-sm"
                />
              </div>
              
              <div className="col-span-3">
                <div className="flex items-center">
                  <input
                    type="number"
                    min="0"
                    max={component.maxScore}
                    value={component.score === null ? '' : component.score}
                    onChange={(e) => handleScoreChange(component, e.target.value)}
                    placeholder="Not graded"
                    className="input py-1 px-2 text-sm w-20"
                  />
                  <span className="ml-1 text-gray-500 dark:text-gray-400">
                    / {component.maxScore}
                  </span>
                </div>
              </div>
              
              <div className="col-span-3">
                <button
                  onClick={() => handleDeleteComponent(component.id)}
                  className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                  aria-label="Delete component"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          
          <div className="mt-2 text-right">
            <span
              className={`font-medium ${
                totalWeight > 100
                  ? 'text-red-500'
                  : totalWeight < 100
                  ? 'text-yellow-500'
                  : 'text-green-500'
              }`}
            >
              Total Weight: {totalWeight}%
            </span>
            {totalWeight !== 100 && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {totalWeight > 100
                  ? 'Total weight exceeds 100%. Please adjust your weights.'
                  : `${100 - totalWeight}% remaining to be allocated.`}
              </p>
            )}
          </div>
        </div>
      )}
      
      <form onSubmit={handleAddComponent} className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-5">
          <label htmlFor="component-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Component Name
          </label>
          <input
            id="component-name"
            type="text"
            value={newComponentName}
            onChange={(e) => setNewComponentName(e.target.value)}
            placeholder="e.g., Midterm Exam"
            className={`input w-full ${errors.name ? 'border-red-500' : ''}`}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>
        
        <div className="md:col-span-3">
          <label htmlFor="component-weight" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Weight (%)
          </label>
          <input
            id="component-weight"
            type="number"
            min="0"
            max="100"
            value={newComponentWeight}
            onChange={(e) => setNewComponentWeight(e.target.value)}
            className={`input w-full ${errors.weight ? 'border-red-500' : ''}`}
          />
          {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
        </div>
        
        <div className="md:col-span-4 flex items-end">
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={!newComponentName.trim() || !newComponentWeight.trim()}
          >
            Add Component
          </button>
        </div>
      </form>
    </div>
  );
};

export default GradeForm;