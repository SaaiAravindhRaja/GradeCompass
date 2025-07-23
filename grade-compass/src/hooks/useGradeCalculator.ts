import { useMemo } from 'react';
import type { GradeComponent } from '../types/models';
import {
  calculateCurrentGrade,
  calculateCompletedWeight,
  calculateRemainingWeight,
  isAllComponentsCompleted,
} from '../utils/gradeCalculator';

/**
 * Custom hook for calculating grade statistics
 * @param components Array of grade components
 * @returns Object with calculated grade statistics
 */
export const useGradeCalculator = (components: GradeComponent[]) => {
  const currentGrade = useMemo(() => calculateCurrentGrade(components), [components]);
  
  const completedWeight = useMemo(() => calculateCompletedWeight(components), [components]);
  
  const remainingWeight = useMemo(() => calculateRemainingWeight(components), [components]);
  
  const isComplete = useMemo(() => isAllComponentsCompleted(components), [components]);
  
  const totalWeight = useMemo(
    () => components.reduce((sum, component) => sum + component.weight, 0),
    [components]
  );
  
  return {
    currentGrade,
    completedWeight,
    remainingWeight,
    isComplete,
    totalWeight,
  };
};