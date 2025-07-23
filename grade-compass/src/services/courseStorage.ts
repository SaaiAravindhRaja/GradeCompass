/**
 * Service for managing course data persistence
 */
import { v4 as uuidv4 } from 'uuid';
import type { Course, GradeComponent } from '../types/models';
import {
  safelyStoreData,
  safelyRetrieveData,
  safelyRemoveData,
  safelyClearAllData,
  serializeCourses,
  deserializeCourses,
  isLocalStorageAvailable,
} from '../utils/storage';

// Constants
const COURSES_STORAGE_KEY = 'gradeCompass_courses';
const ACTIVE_COURSE_ID_KEY = 'gradeCompass_activeCourseId';

/**
 * Creates a new course with default values
 */
export const createCourse = (name: string): Course => {
  const now = new Date();
  return {
    id: uuidv4(),
    name,
    components: [],
    targetGrade: 90, // Default target grade
    createdAt: now,
    updatedAt: now,
  };
};

/**
 * Creates a new grade component with default values
 */
export const createComponent = (name: string, weight: number): GradeComponent => {
  return {
    id: uuidv4(),
    name,
    weight,
    score: null,
    maxScore: 100, // Default max score
    isCompleted: false,
  };
};

/**
 * Saves courses to localStorage
 */
export const saveCourses = (courses: Course[]): boolean => {
  return safelyStoreData(COURSES_STORAGE_KEY, serializeCourses(courses));
};

/**
 * Retrieves courses from localStorage
 */
export const getCourses = (): Course[] => {
  const coursesData = safelyRetrieveData<Record<string, any>[]>(COURSES_STORAGE_KEY, []);
  return deserializeCourses(coursesData);
};

/**
 * Saves active course ID to localStorage
 */
export const saveActiveCourseId = (courseId: string | null): boolean => {
  return safelyStoreData(ACTIVE_COURSE_ID_KEY, courseId);
};

/**
 * Retrieves active course ID from localStorage
 */
export const getActiveCourseId = (): string | null => {
  return safelyRetrieveData<string | null>(ACTIVE_COURSE_ID_KEY, null);
};

/**
 * Adds a new course and saves to localStorage
 */
export const addCourse = (name: string): { course: Course; success: boolean } => {
  const courses = getCourses();
  const newCourse = createCourse(name);
  const updatedCourses = [...courses, newCourse];
  const success = saveCourses(updatedCourses);
  
  // If this is the first course, set it as active
  if (courses.length === 0) {
    saveActiveCourseId(newCourse.id);
  }
  
  return { course: newCourse, success };
};

/**
 * Updates an existing course and saves to localStorage
 */
export const updateCourse = (updatedCourse: Course): boolean => {
  const courses = getCourses();
  const index = courses.findIndex((c) => c.id === updatedCourse.id);
  
  if (index === -1) {
    return false;
  }
  
  // Update the updatedAt timestamp
  const courseToSave = {
    ...updatedCourse,
    updatedAt: new Date(),
  };
  
  const updatedCourses = [
    ...courses.slice(0, index),
    courseToSave,
    ...courses.slice(index + 1),
  ];
  
  return saveCourses(updatedCourses);
};

/**
 * Deletes a course and saves to localStorage
 */
export const deleteCourse = (courseId: string): boolean => {
  const courses = getCourses();
  const updatedCourses = courses.filter((c) => c.id !== courseId);
  
  // If we're deleting the active course, update the active course ID
  const activeCourseId = getActiveCourseId();
  if (activeCourseId === courseId) {
    saveActiveCourseId(updatedCourses.length > 0 ? updatedCourses[0].id : null);
  }
  
  return saveCourses(updatedCourses);
};

/**
 * Clears all course data from localStorage
 */
export const clearAllCourseData = (): boolean => {
  const clearCoursesSuccess = safelyRemoveData(COURSES_STORAGE_KEY);
  const clearActiveIdSuccess = safelyRemoveData(ACTIVE_COURSE_ID_KEY);
  return clearCoursesSuccess && clearActiveIdSuccess;
};

/**
 * Checks if localStorage is available for course storage
 */
export const isCourseStorageAvailable = (): boolean => {
  return isLocalStorageAvailable();
};

/**
 * Gets a course by ID
 */
export const getCourseById = (courseId: string): Course | null => {
  const courses = getCourses();
  return courses.find((c) => c.id === courseId) || null;
};

/**
 * Gets the active course
 */
export const getActiveCourse = (): Course | null => {
  const activeCourseId = getActiveCourseId();
  if (!activeCourseId) {
    return null;
  }
  return getCourseById(activeCourseId);
};