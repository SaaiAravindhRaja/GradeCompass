import { Course } from '../types/models';

const LOCAL_STORAGE_KEY = 'gradeCompassCourses';

export const loadCourses = (): Course[] => {
  try {
    const item = localStorage.getItem(LOCAL_STORAGE_KEY);
    return item ? JSON.parse(item) : [];
  } catch (error) {
    console.error('Error loading courses from localStorage:', error);
    return [];
  }
};

export const saveCourses = (courses: Course[]): void => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(courses));
  } catch (error) {
    console.error('Error saving courses to localStorage:', error);
  }
};
