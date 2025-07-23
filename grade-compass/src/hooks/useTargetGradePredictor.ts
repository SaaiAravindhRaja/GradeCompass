import { useMemo } from 'react';
import type { GradeComponent } from '../types/models';
import {
  calculateRequiredAverage,
  isTargetAchievable,
  generateRecommendations,
} from '../utils/gradeCalculator';

/**
 * Custom hook for predicting target grade requirements
 * @param components Array of grade components
 * @param targetGrade The target grade percentage (0-100)
 * @returns Object with target grade prediction data
 */
export const useTargetGradePredictor = (
  components: GradeComponent[],
  targetGrade: number
) => {
  const requiredAverage = useMemo(
    () => calculateRequiredAverage(components, targetGrade),
    [components, targetGrade]
  );
  
  const isAchievable = useMemo(
    () => isTargetAchievable(components, targetGrade),
    [components, targetGrade]
  );
  
  const recommendations = useMemo(
    () => generateRecommendations(components, targetGrade),
    [components, targetGrade]
  );
  
  return {
    requiredAverage,
    isAchievable,
    recommendations,
  };
};