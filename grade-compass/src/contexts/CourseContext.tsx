import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Course, Assessment } from '../types/models';
import { loadCourses, saveCourses } from '../services/courseStorage';
import { v4 as uuidv4 } from 'uuid';

interface CourseContextType {
  courses: Course[];
  addCourse: (name: string, credits: number) => void;
  updateCourse: (courseId: string, updatedCourse: Partial<Course>) => void;
  deleteCourse: (courseId: string) => void;
  addAssessment: (courseId: string, name: string, weight: number) => void;
  updateAssessment: (courseId: string, assessmentId: string, updatedAssessment: Partial<Assessment>) => void;
  deleteAssessment: (courseId: string, assessmentId: string) => void;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

interface CourseProviderProps {
  children: ReactNode;
}

export const CourseProvider: React.FC<CourseProviderProps> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    setCourses(loadCourses());
  }, []);

  useEffect(() => {
    saveCourses(courses);
  }, [courses]);

  const addCourse = (name: string, credits: number) => {
    const newCourse: Course = {
      id: uuidv4(),
      name,
      credits,
      assessments: [],
    };
    setCourses((prevCourses) => [...prevCourses, newCourse]);
  };

  const updateCourse = (courseId: string, updatedCourse: Partial<Course>) => {
    setCourses((prevCourses) =>
      prevCourses.map((course) =>
        course.id === courseId ? { ...course, ...updatedCourse } : course
      )
    );
  };

  const deleteCourse = (courseId: string) => {
    setCourses((prevCourses) => prevCourses.filter((course) => course.id !== courseId));
  };

  const addAssessment = (courseId: string, name: string, weight: number) => {
    setCourses((prevCourses) =>
      prevCourses.map((course) =>
        course.id === courseId
          ? {
              ...course,
              assessments: [
                ...course.assessments,
                { id: uuidv4(), name, weight, grade: null },
              ],
            }
          : course
      )
    );
  };

  const updateAssessment = (
    courseId: string,
    assessmentId: string,
    updatedAssessment: Partial<Assessment>
  ) => {
    setCourses((prevCourses) =>
      prevCourses.map((course) =>
        course.id === courseId
          ? {
              ...course,
              assessments: course.assessments.map((assessment) =>
                assessment.id === assessmentId
                  ? { ...assessment, ...updatedAssessment }
                  : assessment
              ),
            }
          : course
      )
    );
  };

  const deleteAssessment = (courseId: string, assessmentId: string) => {
    setCourses((prevCourses) =>
      prevCourses.map((course) =>
        course.id === courseId
          ? {
              ...course,
              assessments: course.assessments.filter(
                (assessment) => assessment.id !== assessmentId
              ),
            }
          : course
      )
    );
  };

  return (
    <CourseContext.Provider
      value={{
        courses,
        addCourse,
        updateCourse,
        deleteCourse,
        addAssessment,
        updateAssessment,
        deleteAssessment,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};

export const useCourses = () => {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error('useCourses must be used within a CourseProvider');
  }
  return context;
};
