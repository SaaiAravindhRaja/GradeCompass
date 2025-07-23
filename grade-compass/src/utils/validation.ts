import { GradeComponent } from '../types/models';

/**
 * Validate a course name
 * @param name The course name to validate
 * @returns An error message if invalid, or null if valid
 */
export const validateCourseName = (name: string): string | null => {
  if (!name.trim()) {
    return 'Course name is required';
  }
  
  if (name.length > 100) {
    return 'Course name must be less than 100 characters';
  }
  
  return null;
};

/**
 * Validate a component name
 * @param name The component name to validate
 * @returns An error message if invalid, or null if valid
 */
export const validateComponentName = (name: string): string | null => {
  if (!name.trim()) {
    return 'Component name is required';
  }
  
  if (name.length > 100) {
    return 'Component name must be less than 100 characters';
  }
  
  return null;
};

/**
 * Validate a weight value
 * @param weight The weight value to validate
 * @returns An error message if invalid, or null if valid
 */
export const validateWeight = (weight: number | string): string | null => {
  const weightNum = typeof weight === 'string' ? parseFloat(weight) : weight;
  
  if (isNaN(weightNum)) {
    return 'Weight must be a number';
  }
  
  if (weightNum < 0) {
    return 'Weight cannot be negative';
  }
  
  if (weightNum > 100) {
    return 'Weight cannot exceed 100%';
  }
  
  return null;
};

/**
 * Validate a score value
 * @param score The score value to validate
 * @param maxScore The maximum possible score
 * @returns An error message if invalid, or null if valid
 */
export const validateScore = (
  score: number | string | null,
  maxScore: number
): string | null => {
  if (score === null) {
    return null; // Null score is valid (not completed yet)
  }
  
  const scoreNum = typeof score === 'string' ? parseFloat(score) : score;
  
  if (isNaN(scoreNum)) {
    return 'Score must be a number';
  }
  
  if (scoreNum < 0) {
    return 'Score cannot be negative';
  }
  
  if (scoreNum > maxScore) {
    return `Score cannot exceed maximum score of ${maxScore}`;
  }
  
  return null;
};

/**
 * Validate a target grade value
 * @param targetGrade The target grade to validate
 * @returns An error message if invalid, or null if valid
 */
export const validateTargetGrade = (targetGrade: number | string): string | null => {
  const gradeNum = typeof targetGrade === 'string' ? parseFloat(targetGrade) : targetGrade;
  
  if (isNaN(gradeNum)) {
    return 'Target grade must be a number';
  }
  
  if (gradeNum < 0) {
    return 'Target grade cannot be negative';
  }
  
  if (gradeNum > 100) {
    return 'Target grade cannot exceed 100%';
  }
  
  return null;
};

/**
 * Validate the total weight of components
 * @param components Array of grade components
 * @returns An error message if invalid, or null if valid
 */
export const validateTotalWeight = (components: GradeComponent[]): string | null => {
  const totalWeight = components.reduce((sum, component) => sum + component.weight, 0);
  
  if (totalWeight > 100) {
    return `Total weight (${totalWeight}%) exceeds 100%`;
  }
  
  return null;
};