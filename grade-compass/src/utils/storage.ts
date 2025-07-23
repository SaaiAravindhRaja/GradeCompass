/**
 * Utility functions for data serialization and deserialization
 * for localStorage persistence
 */
import { Course } from '../types/models';

/**
 * Serializes a Date object to ISO string for storage
 */
export const serializeDate = (date: Date): string => {
  return date.toISOString();
};

/**
 * Deserializes an ISO string to a Date object
 */
export const deserializeDate = (dateString: string): Date => {
  return new Date(dateString);
};

/**
 * Serializes a Course object for storage
 */
export const serializeCourse = (course: Course): Record<string, any> => {
  return {
    ...course,
    createdAt: serializeDate(course.createdAt),
    updatedAt: serializeDate(course.updatedAt),
  };
};

/**
 * Deserializes a Course object from storage
 */
export const deserializeCourse = (courseData: Record<string, any>): Course => {
  return {
    ...courseData,
    createdAt: deserializeDate(courseData.createdAt),
    updatedAt: deserializeDate(courseData.updatedAt),
  };
};

/**
 * Serializes an array of Course objects for storage
 */
export const serializeCourses = (courses: Course[]): Record<string, any>[] => {
  return courses.map(serializeCourse);
};

/**
 * Deserializes an array of Course objects from storage
 */
export const deserializeCourses = (coursesData: Record<string, any>[]): Course[] => {
  return coursesData.map(deserializeCourse);
};

/**
 * Checks if localStorage is available
 */
export const isLocalStorageAvailable = (): boolean => {
  try {
    const testKey = '__test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Safely stores data in localStorage with error handling
 */
export const safelyStoreData = <T>(key: string, data: T): boolean => {
  try {
    if (!isLocalStorageAvailable()) {
      return false;
    }
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error storing data in localStorage for key "${key}":`, error);
    return false;
  }
};

/**
 * Safely retrieves data from localStorage with error handling
 */
export const safelyRetrieveData = <T>(key: string, defaultValue: T): T => {
  try {
    if (!isLocalStorageAvailable()) {
      return defaultValue;
    }
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error retrieving data from localStorage for key "${key}":`, error);
    return defaultValue;
  }
};

/**
 * Safely removes data from localStorage with error handling
 */
export const safelyRemoveData = (key: string): boolean => {
  try {
    if (!isLocalStorageAvailable()) {
      return false;
    }
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing data from localStorage for key "${key}":`, error);
    return false;
  }
};

/**
 * Safely clears all data from localStorage with error handling
 */
export const safelyClearAllData = (): boolean => {
  try {
    if (!isLocalStorageAvailable()) {
      return false;
    }
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing all data from localStorage:', error);
    return false;
  }
};