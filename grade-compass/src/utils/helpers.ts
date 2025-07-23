/**
 * Generate a unique ID
 * @returns A unique string ID
 */
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

/**
 * Format a number as a percentage
 * @param value The number to format
 * @param decimals Number of decimal places
 * @returns Formatted percentage string
 */
export const formatPercentage = (
  value: number | null,
  decimals: number = 1
): string => {
  if (value === null) {
    return 'N/A';
  }
  return `${value.toFixed(decimals)}%`;
};

/**
 * Format a date to a readable string
 * @param date The date to format
 * @returns Formatted date string
 */
export const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Convert a letter grade to a percentage
 * @param letter The letter grade (A, B, C, etc.)
 * @returns The corresponding percentage or null if invalid
 */
export const letterGradeToPercentage = (letter: string): number | null => {
  const gradeMap: Record<string, number> = {
    'A+': 97,
    'A': 93,
    'A-': 90,
    'B+': 87,
    'B': 83,
    'B-': 80,
    'C+': 77,
    'C': 73,
    'C-': 70,
    'D+': 67,
    'D': 63,
    'D-': 60,
    'F': 50,
  };
  
  return gradeMap[letter.toUpperCase()] || null;
};

/**
 * Convert a percentage to a letter grade
 * @param percentage The percentage (0-100)
 * @returns The corresponding letter grade
 */
export const percentageToLetterGrade = (percentage: number | null): string => {
  if (percentage === null) {
    return 'N/A';
  }
  
  if (percentage >= 97) return 'A+';
  if (percentage >= 93) return 'A';
  if (percentage >= 90) return 'A-';
  if (percentage >= 87) return 'B+';
  if (percentage >= 83) return 'B';
  if (percentage >= 80) return 'B-';
  if (percentage >= 77) return 'C+';
  if (percentage >= 73) return 'C';
  if (percentage >= 70) return 'C-';
  if (percentage >= 67) return 'D+';
  if (percentage >= 63) return 'D';
  if (percentage >= 60) return 'D-';
  return 'F';
};