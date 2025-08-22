import { useMemo } from 'react';
import { Course } from '../types/models';
import { calculateCourseGrade, calculateRemainingWeight, calculateTargetGradeNeeded } from '../utils/gradeCalculator';

interface GradeAnalysisResult {
  currentGrade: number | null;
  remainingWeight: number;
  gradeNeededForTarget: (target: number) => number | null;
}

const useGradeAnalysis = (course: Course | undefined): GradeAnalysisResult => {
  const currentGrade = useMemo(() => {
    if (!course) return null;
    return calculateCourseGrade(course);
  }, [course]);

  const remainingWeight = useMemo(() => {
    if (!course) return 100;
    return calculateRemainingWeight(course);
  }, [course]);

  const gradeNeededForTarget = (target: number): number | null => {
    if (!course) return null;
    return calculateTargetGradeNeeded(course, target, remainingWeight);
  };

  return {
    currentGrade,
    remainingWeight,
    gradeNeededForTarget,
  };
};

export default useGradeAnalysis;
