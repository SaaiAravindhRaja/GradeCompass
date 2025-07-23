import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Course, GradeComponent } from '../types/models';
import {
  getCourses,
  getActiveCourseId,
  saveActiveCourseId,
  addCourse as addCourseToStorage,
  updateCourse as updateCourseInStorage,
  deleteCourse as deleteCourseFromStorage,
  clearAllCourseData,
  isCourseStorageAvailable,
  createComponent as createComponentUtil,
} from '../services/courseStorage';

interface CourseContextType {
  courses: Course[];
  activeCourseId: string | null;
  activeCourse: Course | null;
  isStorageAvailable: boolean;
  addCourse: (name: string) => Course;
  updateCourse: (course: Course) => boolean;
  deleteCourse: (courseId: string) => boolean;
  setActiveCourseId: (courseId: string | null) => void;
  clearAllData: () => boolean;
  addComponent: (courseName: string, weight: number) => GradeComponent | null;
  updateComponent: (componentId: string, updates: Partial<GradeComponent>) => boolean;
  deleteComponent: (componentId: string) => boolean;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

interface CourseProviderProps {
  children: ReactNode;
}

export const CourseProvider: React.FC<CourseProviderProps> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [isStorageAvailable, setIsStorageAvailable] = useState<boolean>(true);

  // Initialize data from localStorage
  useEffect(() => {
    const storageAvailable = isCourseStorageAvailable();
    setIsStorageAvailable(storageAvailable);
    
    if (storageAvailable) {
      setCourses(getCourses());
      setActiveCourseId(getActiveCourseId());
    }
  }, []);

  // Get the active course
  const activeCourse = courses.find((course) => course.id === activeCourseId) || null;

  // Set active course ID and save to localStorage
  const handleSetActiveCourseId = (courseId: string | null) => {
    setActiveCourseId(courseId);
    saveActiveCourseId(courseId);
  };

  // Add a new course
  const addCourse = (name: string): Course => {
    const { course, success } = addCourseToStorage(name);
    
    if (success) {
      setCourses((prevCourses) => [...prevCourses, course]);
      
      // If this is the first course, set it as active
      if (courses.length === 0) {
        handleSetActiveCourseId(course.id);
      }
    }
    
    return course;
  };

  // Update an existing course
  const updateCourse = (updatedCourse: Course): boolean => {
    const success = updateCourseInStorage(updatedCourse);
    
    if (success) {
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.id === updatedCourse.id ? updatedCourse : course
        )
      );
    }
    
    return success;
  };

  // Delete a course
  const deleteCourse = (courseId: string): boolean => {
    const success = deleteCourseFromStorage(courseId);
    
    if (success) {
      setCourses((prevCourses) => prevCourses.filter((course) => course.id !== courseId));
      
      // If we're deleting the active course, update the active course ID
      if (activeCourseId === courseId) {
        const remainingCourses = courses.filter((course) => course.id !== courseId);
        handleSetActiveCourseId(remainingCourses.length > 0 ? remainingCourses[0].id : null);
      }
    }
    
    return success;
  };

  // Clear all data
  const clearAllData = (): boolean => {
    const success = clearAllCourseData();
    
    if (success) {
      setCourses([]);
      setActiveCourseId(null);
    }
    
    return success;
  };

  // Add a component to the active course
  const addComponent = (componentName: string, weight: number): GradeComponent | null => {
    if (!activeCourse) {
      return null;
    }
    
    const newComponent = createComponentUtil(componentName, weight);
    const updatedCourse = {
      ...activeCourse,
      components: [...activeCourse.components, newComponent],
    };
    
    const success = updateCourse(updatedCourse);
    return success ? newComponent : null;
  };

  // Update a component in the active course
  const updateComponent = (componentId: string, updates: Partial<GradeComponent>): boolean => {
    if (!activeCourse) {
      return false;
    }
    
    const componentIndex = activeCourse.components.findIndex((c) => c.id === componentId);
    
    if (componentIndex === -1) {
      return false;
    }
    
    const updatedComponents = [...activeCourse.components];
    updatedComponents[componentIndex] = {
      ...updatedComponents[componentIndex],
      ...updates,
    };
    
    const updatedCourse = {
      ...activeCourse,
      components: updatedComponents,
    };
    
    return updateCourse(updatedCourse);
  };

  // Delete a component from the active course
  const deleteComponent = (componentId: string): boolean => {
    if (!activeCourse) {
      return false;
    }
    
    const updatedComponents = activeCourse.components.filter((c) => c.id !== componentId);
    
    const updatedCourse = {
      ...activeCourse,
      components: updatedComponents,
    };
    
    return updateCourse(updatedCourse);
  };

  const value = {
    courses,
    activeCourseId,
    activeCourse,
    isStorageAvailable,
    addCourse,
    updateCourse,
    deleteCourse,
    setActiveCourseId: handleSetActiveCourseId,
    clearAllData,
    addComponent,
    updateComponent,
    deleteComponent,
  };

  return <CourseContext.Provider value={value}>{children}</CourseContext.Provider>;
};

export const useCourses = (): CourseContextType => {
  const context = useContext(CourseContext);
  
  if (context === undefined) {
    throw new Error('useCourses must be used within a CourseProvider');
  }
  
  return context;
};