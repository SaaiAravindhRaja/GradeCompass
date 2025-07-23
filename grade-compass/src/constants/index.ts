/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  COURSES: 'gradeCompass_courses',
  ACTIVE_COURSE_ID: 'gradeCompass_activeCourseId',
  DARK_MODE: 'gradeCompass_darkMode',
};

/**
 * Default values
 */
export const DEFAULTS = {
  TARGET_GRADE: 90,
  MAX_SCORE: 100,
  COMPONENT_WEIGHT: 10,
};

/**
 * Common grade presets
 */
export const GRADE_PRESETS = [
  { label: 'A', value: 93 },
  { label: 'B', value: 83 },
  { label: 'C', value: 73 },
  { label: 'D', value: 63 },
  { label: 'Pass', value: 60 },
];

/**
 * Chart colors
 */
export const CHART_COLORS = {
  COMPLETED: '#10B981', // Green
  REMAINING: '#3B82F6', // Blue
  FAILED: '#EF4444',    // Red
  WARNING: '#F59E0B',   // Yellow
};