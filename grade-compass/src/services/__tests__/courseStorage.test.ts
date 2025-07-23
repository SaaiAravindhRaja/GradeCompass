import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  createCourse,
  createComponent,
  saveCourses,
  getCourses,
  saveActiveCourseId,
  getActiveCourseId,
  addCourse,
  updateCourse,
  deleteCourse,
  clearAllCourseData,
  isCourseStorageAvailable,
  getCourseById,
  getActiveCourse,
} from '../courseStorage';
import * as storageUtils from '../../utils/storage';
import type { Course } from '../../types/models';

// Mock the uuid function
vi.mock('uuid', () => ({
  v4: () => 'mock-uuid',
}));

describe('Course Storage Service', () => {
  // Mock the storage utilities
  beforeEach(() => {
    vi.resetAllMocks();
    
    // Mock the storage utility functions
    vi.spyOn(storageUtils, 'safelyStoreData').mockImplementation(() => true);
    vi.spyOn(storageUtils, 'safelyRetrieveData').mockImplementation(() => []);
    vi.spyOn(storageUtils, 'safelyRemoveData').mockImplementation(() => true);
    vi.spyOn(storageUtils, 'isLocalStorageAvailable').mockImplementation(() => true);
    vi.spyOn(storageUtils, 'serializeCourses').mockImplementation((courses) => 
      courses.map(c => ({ ...c, createdAt: c.createdAt.toISOString(), updatedAt: c.updatedAt.toISOString() }))
    );
    vi.spyOn(storageUtils, 'deserializeCourses').mockImplementation((coursesData) => 
      coursesData.map(c => ({ ...c, createdAt: new Date(c.createdAt), updatedAt: new Date(c.updatedAt) }))
    );
  });

  describe('createCourse', () => {
    it('should create a new course with the given name', () => {
      const course = createCourse('Test Course');
      
      expect(course.id).toBe('mock-uuid');
      expect(course.name).toBe('Test Course');
      expect(course.components).toEqual([]);
      expect(course.targetGrade).toBe(90);
      expect(course.createdAt).toBeInstanceOf(Date);
      expect(course.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('createComponent', () => {
    it('should create a new component with the given name and weight', () => {
      const component = createComponent('Midterm', 30);
      
      expect(component.id).toBe('mock-uuid');
      expect(component.name).toBe('Midterm');
      expect(component.weight).toBe(30);
      expect(component.score).toBeNull();
      expect(component.maxScore).toBe(100);
      expect(component.isCompleted).toBe(false);
    });
  });

  describe('saveCourses', () => {
    it('should save courses to localStorage', () => {
      const courses: Course[] = [createCourse('Test Course')];
      
      saveCourses(courses);
      
      expect(storageUtils.safelyStoreData).toHaveBeenCalledWith(
        'gradeCompass_courses',
        expect.any(Array)
      );
      expect(storageUtils.serializeCourses).toHaveBeenCalledWith(courses);
    });
  });

  describe('getCourses', () => {
    it('should retrieve courses from localStorage', () => {
      const mockCourses = [
        {
          id: 'course-1',
          name: 'Test Course',
          components: [],
          targetGrade: 90,
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
        },
      ];
      
      vi.spyOn(storageUtils, 'safelyRetrieveData').mockReturnValueOnce(mockCourses);
      
      const courses = getCourses();
      
      expect(storageUtils.safelyRetrieveData).toHaveBeenCalledWith('gradeCompass_courses', []);
      expect(storageUtils.deserializeCourses).toHaveBeenCalledWith(mockCourses);
      expect(courses).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: 'course-1',
            name: 'Test Course',
          }),
        ])
      );
    });
  });

  describe('saveActiveCourseId', () => {
    it('should save active course ID to localStorage', () => {
      saveActiveCourseId('course-1');
      
      expect(storageUtils.safelyStoreData).toHaveBeenCalledWith(
        'gradeCompass_activeCourseId',
        'course-1'
      );
    });

    it('should handle null course ID', () => {
      saveActiveCourseId(null);
      
      expect(storageUtils.safelyStoreData).toHaveBeenCalledWith(
        'gradeCompass_activeCourseId',
        null
      );
    });
  });

  describe('getActiveCourseId', () => {
    it('should retrieve active course ID from localStorage', () => {
      vi.spyOn(storageUtils, 'safelyRetrieveData').mockReturnValueOnce('course-1');
      
      const courseId = getActiveCourseId();
      
      expect(storageUtils.safelyRetrieveData).toHaveBeenCalledWith(
        'gradeCompass_activeCourseId',
        null
      );
      expect(courseId).toBe('course-1');
    });

    it('should return null when no active course ID is stored', () => {
      const courseId = getActiveCourseId();
      
      expect(courseId).toBeNull();
    });
  });

  describe('addCourse', () => {
    it('should add a new course and save to localStorage', () => {
      const result = addCourse('New Course');
      
      expect(result.course.name).toBe('New Course');
      expect(result.success).toBe(true);
      expect(storageUtils.safelyStoreData).toHaveBeenCalled();
    });

    it('should set the new course as active if it is the first course', () => {
      const result = addCourse('First Course');
      
      expect(storageUtils.safelyStoreData).toHaveBeenCalledWith(
        'gradeCompass_activeCourseId',
        'mock-uuid'
      );
    });

    it('should not change active course if other courses exist', () => {
      // Mock existing courses
      vi.spyOn(storageUtils, 'safelyRetrieveData').mockReturnValueOnce([
        {
          id: 'existing-course',
          name: 'Existing Course',
          components: [],
          targetGrade: 90,
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
        },
      ]);
      
      const result = addCourse('Second Course');
      
      // saveActiveCourseId should not be called
      expect(storageUtils.safelyStoreData).not.toHaveBeenCalledWith(
        'gradeCompass_activeCourseId',
        expect.any(String)
      );
    });
  });

  describe('updateCourse', () => {
    it('should update an existing course', () => {
      // Mock existing courses
      const existingCourses = [
        {
          id: 'course-1',
          name: 'Old Name',
          components: [],
          targetGrade: 90,
          createdAt: new Date('2023-01-01'),
          updatedAt: new Date('2023-01-01'),
        },
      ];
      
      vi.spyOn(storageUtils, 'safelyRetrieveData').mockReturnValueOnce(existingCourses);
      
      const updatedCourse = {
        ...existingCourses[0],
        name: 'New Name',
      };
      
      const result = updateCourse(updatedCourse);
      
      expect(result).toBe(true);
      expect(storageUtils.safelyStoreData).toHaveBeenCalled();
      expect(storageUtils.serializeCourses).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            id: 'course-1',
            name: 'New Name',
          }),
        ])
      );
    });

    it('should return false if course does not exist', () => {
      // Mock empty courses array
      vi.spyOn(storageUtils, 'safelyRetrieveData').mockReturnValueOnce([]);
      
      const nonExistentCourse = {
        id: 'non-existent',
        name: 'Non-existent Course',
        components: [],
        targetGrade: 90,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const result = updateCourse(nonExistentCourse);
      
      expect(result).toBe(false);
    });
  });

  describe('deleteCourse', () => {
    it('should delete a course', () => {
      // Mock existing courses
      const existingCourses = [
        {
          id: 'course-1',
          name: 'Course 1',
          components: [],
          targetGrade: 90,
          createdAt: new Date('2023-01-01'),
          updatedAt: new Date('2023-01-01'),
        },
        {
          id: 'course-2',
          name: 'Course 2',
          components: [],
          targetGrade: 90,
          createdAt: new Date('2023-01-01'),
          updatedAt: new Date('2023-01-01'),
        },
      ];
      
      vi.spyOn(storageUtils, 'safelyRetrieveData')
        .mockReturnValueOnce(existingCourses) // For getCourses
        .mockReturnValueOnce(null); // For getActiveCourseId
      
      const result = deleteCourse('course-1');
      
      expect(result).toBe(true);
      expect(storageUtils.serializeCourses).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            id: 'course-2',
          }),
        ])
      );
      expect(storageUtils.serializeCourses).toHaveBeenCalledWith(
        expect.not.arrayContaining([
          expect.objectContaining({
            id: 'course-1',
          }),
        ])
      );
    });

    it('should update active course ID if deleting the active course', () => {
      // Mock existing courses
      const existingCourses = [
        {
          id: 'course-1',
          name: 'Course 1',
          components: [],
          targetGrade: 90,
          createdAt: new Date('2023-01-01'),
          updatedAt: new Date('2023-01-01'),
        },
        {
          id: 'course-2',
          name: 'Course 2',
          components: [],
          targetGrade: 90,
          createdAt: new Date('2023-01-01'),
          updatedAt: new Date('2023-01-01'),
        },
      ];
      
      vi.spyOn(storageUtils, 'safelyRetrieveData')
        .mockReturnValueOnce(existingCourses) // For getCourses
        .mockReturnValueOnce('course-1'); // For getActiveCourseId
      
      const result = deleteCourse('course-1');
      
      expect(result).toBe(true);
      expect(storageUtils.safelyStoreData).toHaveBeenCalledWith(
        'gradeCompass_activeCourseId',
        'course-2'
      );
    });

    it('should set active course ID to null if deleting the last course', () => {
      // Mock existing courses with only one course
      const existingCourses = [
        {
          id: 'course-1',
          name: 'Course 1',
          components: [],
          targetGrade: 90,
          createdAt: new Date('2023-01-01'),
          updatedAt: new Date('2023-01-01'),
        },
      ];
      
      vi.spyOn(storageUtils, 'safelyRetrieveData')
        .mockReturnValueOnce(existingCourses) // For getCourses
        .mockReturnValueOnce('course-1'); // For getActiveCourseId
      
      const result = deleteCourse('course-1');
      
      expect(result).toBe(true);
      expect(storageUtils.safelyStoreData).toHaveBeenCalledWith(
        'gradeCompass_activeCourseId',
        null
      );
    });
  });

  describe('clearAllCourseData', () => {
    it('should clear all course data from localStorage', () => {
      const result = clearAllCourseData();
      
      expect(result).toBe(true);
      expect(storageUtils.safelyRemoveData).toHaveBeenCalledWith('gradeCompass_courses');
      expect(storageUtils.safelyRemoveData).toHaveBeenCalledWith('gradeCompass_activeCourseId');
    });
  });

  describe('isCourseStorageAvailable', () => {
    it('should check if localStorage is available', () => {
      const result = isCourseStorageAvailable();
      
      expect(result).toBe(true);
      expect(storageUtils.isLocalStorageAvailable).toHaveBeenCalled();
    });
  });

  describe('getCourseById', () => {
    it('should get a course by ID', () => {
      // Mock existing courses
      const existingCourses = [
        {
          id: 'course-1',
          name: 'Course 1',
          components: [],
          targetGrade: 90,
          createdAt: new Date('2023-01-01'),
          updatedAt: new Date('2023-01-01'),
        },
        {
          id: 'course-2',
          name: 'Course 2',
          components: [],
          targetGrade: 90,
          createdAt: new Date('2023-01-01'),
          updatedAt: new Date('2023-01-01'),
        },
      ];
      
      vi.spyOn(storageUtils, 'safelyRetrieveData').mockReturnValueOnce(existingCourses);
      
      const course = getCourseById('course-2');
      
      expect(course).toEqual(
        expect.objectContaining({
          id: 'course-2',
          name: 'Course 2',
        })
      );
    });

    it('should return null if course does not exist', () => {
      // Mock empty courses array
      vi.spyOn(storageUtils, 'safelyRetrieveData').mockReturnValueOnce([]);
      
      const course = getCourseById('non-existent');
      
      expect(course).toBeNull();
    });
  });

  describe('getActiveCourse', () => {
    it('should get the active course', () => {
      // Mock active course ID
      vi.spyOn(storageUtils, 'safelyRetrieveData')
        .mockReturnValueOnce('course-1') // For getActiveCourseId
        .mockReturnValueOnce([
          {
            id: 'course-1',
            name: 'Active Course',
            components: [],
            targetGrade: 90,
            createdAt: new Date('2023-01-01'),
            updatedAt: new Date('2023-01-01'),
          },
        ]); // For getCourses
      
      const course = getActiveCourse();
      
      expect(course).toEqual(
        expect.objectContaining({
          id: 'course-1',
          name: 'Active Course',
        })
      );
    });

    it('should return null if no active course ID', () => {
      // Mock no active course ID
      vi.spyOn(storageUtils, 'safelyRetrieveData').mockReturnValueOnce(null);
      
      const course = getActiveCourse();
      
      expect(course).toBeNull();
    });

    it('should return null if active course does not exist', () => {
      // Mock active course ID but no matching course
      vi.spyOn(storageUtils, 'safelyRetrieveData')
        .mockReturnValueOnce('non-existent') // For getActiveCourseId
        .mockReturnValueOnce([]); // For getCourses
      
      const course = getActiveCourse();
      
      expect(course).toBeNull();
    });
  });
});