import type { GradeComponent } from '../types/models';

/**
 * Calculate the current weighted grade based on completed components
 * @param components Array of grade components
 * @returns The current weighted grade (0-100) or null if no components are completed
 */
export const calculateCurrentGrade = (components: GradeComponent[]): number | null => {
  const completedComponents = components.filter(
    component => component.isCompleted && component.score !== null
  );
  
  if (completedComponents.length === 0) {
    return null;
  }
  
  const totalWeightedScore = completedComponents.reduce(
    (sum, component) => sum + ((component.score! / component.maxScore) * component.weight),
    0
  );
  
  const totalWeight = completedComponents.reduce(
    (sum, component) => sum + component.weight,
    0
  );
  
  return totalWeight > 0 ? (totalWeightedScore / totalWeight) * 100 : null;
};

/**
 * Calculate the total weight of completed components
 * @param components Array of grade components
 * @returns The total weight of completed components (0-100)
 */
export const calculateCompletedWeight = (components: GradeComponent[]): number => {
  return components
    .filter(component => component.isCompleted)
    .reduce((sum, component) => sum + component.weight, 0);
};

/**
 * Calculate the total weight of remaining components
 * @param components Array of grade components
 * @returns The total weight of remaining components (0-100)
 */
export const calculateRemainingWeight = (components: GradeComponent[]): number => {
  return components
    .filter(component => !component.isCompleted)
    .reduce((sum, component) => sum + component.weight, 0);
};

/**
 * Check if all components are completed
 * @param components Array of grade components
 * @returns True if all components are completed, false otherwise
 */
export const isAllComponentsCompleted = (components: GradeComponent[]): boolean => {
  return components.length > 0 && components.every(component => component.isCompleted);
};

/**
 * Calculate the required average score on remaining components to achieve target grade
 * @param components Array of grade components
 * @param targetGrade The target grade percentage (0-100)
 * @returns The required average score (0-100) or null if no remaining components
 */
export const calculateRequiredAverage = (
  components: GradeComponent[],
  targetGrade: number
): number | null => {
  const completedComponents = components.filter(
    component => component.isCompleted && component.score !== null
  );
  const remainingComponents = components.filter(component => !component.isCompleted);
  
  if (remainingComponents.length === 0) {
    return null;
  }
  
  const totalWeight = components.reduce((sum, component) => sum + component.weight, 0);
  const targetPoints = (targetGrade / 100) * totalWeight;
  
  const earnedPoints = completedComponents.reduce(
    (sum, component) => sum + ((component.score! / component.maxScore) * component.weight),
    0
  );
  
  const remainingWeight = remainingComponents.reduce(
    (sum, component) => sum + component.weight,
    0
  );
  
  const requiredPoints = targetPoints - earnedPoints;
  
  return remainingWeight > 0 ? (requiredPoints / remainingWeight) * 100 : null;
};

/**
 * Check if the target grade is achievable
 * @param components Array of grade components
 * @param targetGrade The target grade percentage (0-100)
 * @returns True if the target grade is achievable, false otherwise
 */
export const isTargetAchievable = (
  components: GradeComponent[],
  targetGrade: number
): boolean => {
  const requiredAvg = calculateRequiredAverage(components, targetGrade);
  
  // If all components are completed, check if current grade meets target
  if (requiredAvg === null) {
    const currentGrade = calculateCurrentGrade(components);
    return currentGrade !== null && currentGrade >= targetGrade;
  }
  
  // Target is achievable if required average is <= 100%
  return requiredAvg <= 100;
};

/**
 * Generate recommendations based on current grades and target
 * @param components Array of grade components
 * @param targetGrade The target grade percentage (0-100)
 * @returns Array of recommendation strings
 */
export const generateRecommendations = (
  components: GradeComponent[],
  targetGrade: number
): string[] => {
  const recommendations: string[] = [];
  const currentGrade = calculateCurrentGrade(components);
  const requiredAvg = calculateRequiredAverage(components, targetGrade);
  const achievable = isTargetAchievable(components, targetGrade);
  
  if (components.length === 0) {
    recommendations.push('Add your first grade component to get started.');
    return recommendations;
  }
  
  if (currentGrade === null) {
    recommendations.push('Enter scores for completed components to see your current grade.');
  } else if (isAllComponentsCompleted(components)) {
    if (currentGrade >= targetGrade) {
      recommendations.push(`Congratulations! You've achieved your target grade of ${targetGrade}%.`);
    } else {
      recommendations.push(`Your final grade (${currentGrade.toFixed(1)}%) is below your target of ${targetGrade}%.`);
    }
    return recommendations;
  }
  
  if (requiredAvg !== null) {
    if (achievable) {
      recommendations.push(
        `You need to score an average of ${requiredAvg.toFixed(1)}% on remaining assessments to reach your target.`
      );
      
      if (requiredAvg > 90) {
        recommendations.push('This will be challenging. Consider adjusting your target or seeking additional help.');
      } else if (requiredAvg < 50) {
        recommendations.push('You\'re in a good position to exceed your target!');
      }
    } else {
      recommendations.push('Your target grade is not mathematically achievable with the remaining assessments.');
      recommendations.push('Consider adjusting your target to a more realistic goal.');
    }
  }
  
  const totalWeight = components.reduce((sum, component) => sum + component.weight, 0);
  if (totalWeight < 100) {
    recommendations.push(`Your components only add up to ${totalWeight}% of the total grade. Add the missing ${100 - totalWeight}%.`);
  } else if (totalWeight > 100) {
    recommendations.push(`Your components add up to ${totalWeight}%, which exceeds 100%. Please adjust the weights.`);
  }
  
  return recommendations;
};