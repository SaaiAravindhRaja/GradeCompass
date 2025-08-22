import { Course, Assessment } from '../types/models';

export const calculateCourseGrade = (course: Course): number | null => {
  if (!course || !course.assessments || course.assessments.length === 0) {
    return null;
  }

  let totalWeightedGrade = 0;
  let totalWeight = 0;

  for (const assessment of course.assessments) {
    if (assessment.grade !== null && assessment.grade >= 0 && assessment.weight > 0) {
      totalWeightedGrade += (assessment.grade / 100) * assessment.weight;
      totalWeight += assessment.weight;
    }
  }

  if (totalWeight === 0) {
    return null; // No graded assessments with valid weights
  }

  return (totalWeightedGrade / totalWeight) * 100;
};

export const calculateRemainingWeight = (course: Course): number => {
  if (!course || !course.assessments) {
    return 100;
  }

  let gradedWeight = 0;
  for (const assessment of course.assessments) {
    if (assessment.grade !== null && assessment.grade >= 0 && assessment.weight > 0) {
      gradedWeight += assessment.weight;
    }
  }
  return 100 - gradedWeight;
};

export const calculateTargetGradeNeeded = (
  course: Course,
  targetGrade: number,
  remainingWeight: number
): number | null => {
  if (remainingWeight <= 0) {
    return null; // No remaining assessments to influence grade
  }

  const currentGrade = calculateCourseGrade(course);
  if (currentGrade === null) {
    // If no current grade, need to get 100% on remaining to hit target
    return targetGrade;
  }

  // current weighted grade = (currentGrade / 100) * (100 - remainingWeight)
  // target weighted grade = (targetGrade / 100) * 100
  // needed weighted grade = target weighted grade - current weighted grade
  // needed grade = (needed weighted grade / remainingWeight) * 100

  const currentWeightedSum = (currentGrade / 100) * (100 - remainingWeight);
  const targetWeightedSum = (targetGrade / 100) * 100;

  const neededWeightedSum = targetWeightedSum - currentWeightedSum;

  if (neededWeightedSum < 0) {
    return 0; // Already exceeded target or can't go below 0
  }

  const gradeNeeded = (neededWeightedSum / remainingWeight) * 100;

  return gradeNeeded;
};
