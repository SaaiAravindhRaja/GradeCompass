import { useMemo } from 'react';
import type { GradeComponent } from '../types/models';
import { useGradeCalculator } from './useGradeCalculator';
import { useTargetGradePredictor } from './useTargetGradePredictor';

/**
 * Combined hook for grade analysis that provides both calculation and prediction
 * @param components Array of grade components
 * @param targetGrade The target grade percentage (0-100)
 * @returns Combined object with all grade analysis data
 */
export const useGradeAnalysis = (
  components: GradeComponent[],
  targetGrade: number
) => {
  const calculationResults = useGradeCalculator(components);
  const predictionResults = useTargetGradePredictor(components, targetGrade);
  
  const letterGrade = useMemo(() => {
    if (calculationResults.currentGrade === null) return 'N/A';
    
    const grade = calculationResults.currentGrade;
    if (grade >= 97) return 'A+';
    if (grade >= 93) return 'A';
    if (grade >= 90) return 'A-';
    if (grade >= 87) return 'B+';
    if (grade >= 83) return 'B';
    if (grade >= 80) return 'B-';
    if (grade >= 77) return 'C+';
    if (grade >= 73) return 'C';
    if (grade >= 70) return 'C-';
    if (grade >= 67) return 'D+';
    if (grade >= 63) return 'D';
    if (grade >= 60) return 'D-';
    return 'F';
  }, [calculationResults.currentGrade]);
  
  return {
    ...calculationResults,
    ...predictionResults,
    letterGrade,
  };
};