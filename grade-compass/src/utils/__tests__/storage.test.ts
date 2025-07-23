import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  serializeDate,
  deserializeDate,
  serializeCourse,
  deserializeCourse,
  serializeCourses,
  deserializeCourses,
  isLocalStorageAvailable,
  safelyStoreData,
  safelyRetrieveData,
  safelyRemoveData,
  safelyClearAllData,
} from '../storage';
import type { Course } from '../../types/models';

describe('Storage Utils', () => {
  describe('Date serialization', () => {
    it('should serialize and deserialize dates correctly', () => {
      const date = new Date('2023-01-01T12:00:00Z');
      const serialized = serializeDate(date);
      expect(serialized).toBe('2023-01-01T12:00:00.000Z');
      
      const deserialized = deserializeDate(serialized);
      expect(deserialized.getTime()).toBe(date.getTime());
    });
  });

  describe('Course serialization', () => {
    const course: Course = {
      id: '123',
      name: 'Test Course',
      components: [
        {
          id: 'comp1',
          name: 'Midterm',
          weight: 30,
          score: 85,
          maxScore: 100,
          isCompleted: true,
        },
      ],
      targetGrade: 90,
      createdAt: new Date('2023-01-01T12:00:00Z'),
      updatedAt: new Date('2023-01-02T12:00:00Z'),
    };

    it('should serialize a course correctly', () => {
      const serialized = serializeCourse(course);
      expect(serialized.id).toBe(course.id);
      expect(serialized.name).toBe(course.name);
      expect(serialized.components).toEqual(course.components);
      expect(serialized.targetGrade).toBe(course.targetGrade);
      expect(serialized.createdAt).toBe('2023-01-01T12:00:00.000Z');
      expect(serialized.updatedAt).toBe('2023-01-02T12:00:00.000Z');
    });

    it('should deserialize a course correctly', () => {
      const serialized = {
        id: '123',
        name: 'Test Course',
        components: [
          {
            id: 'comp1',
            name: 'Midterm',
            weight: 30,
            score: 85,
            maxScore: 100,
            isCompleted: true,
          },
        ],
        targetGrade: 90,
        createdAt: '2023-01-01T12:00:00.000Z',
        updatedAt: '2023-01-02T12:00:00.000Z',
      };

      const deserialized = deserializeCourse(serialized);
      expect(deserialized.id).toBe(course.id);
      expect(deserialized.name).toBe(course.name);
      expect(deserialized.components).toEqual(course.components);
      expect(deserialized.targetGrade).toBe(course.targetGrade);
      expect(deserialized.createdAt.getTime()).toBe(course.createdAt.getTime());
      expect(deserialized.updatedAt.getTime()).toBe(course.updatedAt.getTime());
    });
  });

  describe('Courses array serialization', () => {
    const courses: Course[] = [
      {
        id: '123',
        name: 'Test Course 1',
        components: [],
        targetGrade: 90,
        createdAt: new Date('2023-01-01T12:00:00Z'),
        updatedAt: new Date('2023-01-02T12:00:00Z'),
      },
      {
        id: '456',
        name: 'Test Course 2',
        components: [],
        targetGrade: 85,
        createdAt: new Date('2023-01-03T12:00:00Z'),
        updatedAt: new Date('2023-01-04T12:00:00Z'),
      },
    ];

    it('should serialize an array of courses correctly', () => {
      const serialized = serializeCourses(courses);
      expect(serialized.length).toBe(2);
      expect(serialized[0].id).toBe('123');
      expect(serialized[1].id).toBe('456');
      expect(serialized[0].createdAt).toBe('2023-01-01T12:00:00.000Z');
      expect(serialized[1].createdAt).toBe('2023-01-03T12:00:00.000Z');
    });

    it('should deserialize an array of courses correctly', () => {
      const serialized = [
        {
          id: '123',
          name: 'Test Course 1',
          components: [],
          targetGrade: 90,
          createdAt: '2023-01-01T12:00:00.000Z',
          updatedAt: '2023-01-02T12:00:00.000Z',
        },
        {
          id: '456',
          name: 'Test Course 2',
          components: [],
          targetGrade: 85,
          createdAt: '2023-01-03T12:00:00.000Z',
          updatedAt: '2023-01-04T12:00:00.000Z',
        },
      ];

      const deserialized = deserializeCourses(serialized);
      expect(deserialized.length).toBe(2);
      expect(deserialized[0].id).toBe('123');
      expect(deserialized[1].id).toBe('456');
      expect(deserialized[0].createdAt.getTime()).toBe(courses[0].createdAt.getTime());
      expect(deserialized[1].createdAt.getTime()).toBe(courses[1].createdAt.getTime());
    });
  });

  // Mock localStorage for the remaining tests
  const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: vi.fn((key: string) => store[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value.toString();
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key];
      }),
      clear: vi.fn(() => {
        store = {};
      }),
    };
  })();

  // Replace the global localStorage with our mock
  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });
    
    // Clear the mock calls before each test
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  describe('localStorage availability check', () => {
    it('should return true when localStorage is available', () => {
      expect(isLocalStorageAvailable()).toBe(true);
    });

    it('should return false when localStorage throws an error', () => {
      // Mock localStorage.setItem to throw an error
      localStorageMock.setItem.mockImplementationOnce(() => {
        throw new Error('localStorage is not available');
      });
      
      expect(isLocalStorageAvailable()).toBe(false);
    });
  });

  describe('safelyStoreData', () => {
    it('should store data in localStorage successfully', () => {
      const result = safelyStoreData('testKey', { test: 'value' });
      expect(result).toBe(true);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('testKey', '{"test":"value"}');
    });

    it('should return false when localStorage is not available', () => {
      // Mock isLocalStorageAvailable to return false
      vi.spyOn(window, 'localStorage', 'get').mockImplementationOnce(() => {
        throw new Error('localStorage is not available');
      });
      
      const result = safelyStoreData('testKey', { test: 'value' });
      expect(result).toBe(false);
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });

    it('should handle errors when storing data', () => {
      // Mock localStorage.setItem to throw an error
      localStorageMock.setItem.mockImplementationOnce(() => {
        throw new Error('Storage error');
      });
      
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const result = safelyStoreData('testKey', { test: 'value' });
      
      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('safelyRetrieveData', () => {
    it('should retrieve data from localStorage successfully', () => {
      localStorageMock.getItem.mockReturnValueOnce('{"test":"value"}');
      
      const result = safelyRetrieveData('testKey', { default: 'value' });
      expect(result).toEqual({ test: 'value' });
      expect(localStorageMock.getItem).toHaveBeenCalledWith('testKey');
    });

    it('should return default value when key does not exist', () => {
      localStorageMock.getItem.mockReturnValueOnce(null);
      
      const defaultValue = { default: 'value' };
      const result = safelyRetrieveData('testKey', defaultValue);
      expect(result).toEqual(defaultValue);
    });

    it('should return default value when localStorage is not available', () => {
      // Mock isLocalStorageAvailable to return false
      vi.spyOn(window, 'localStorage', 'get').mockImplementationOnce(() => {
        throw new Error('localStorage is not available');
      });
      
      const defaultValue = { default: 'value' };
      const result = safelyRetrieveData('testKey', defaultValue);
      expect(result).toEqual(defaultValue);
    });

    it('should handle parsing errors', () => {
      localStorageMock.getItem.mockReturnValueOnce('invalid json');
      
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const defaultValue = { default: 'value' };
      const result = safelyRetrieveData('testKey', defaultValue);
      
      expect(result).toEqual(defaultValue);
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('safelyRemoveData', () => {
    it('should remove data from localStorage successfully', () => {
      const result = safelyRemoveData('testKey');
      expect(result).toBe(true);
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('testKey');
    });

    it('should return false when localStorage is not available', () => {
      // Mock isLocalStorageAvailable to return false
      vi.spyOn(window, 'localStorage', 'get').mockImplementationOnce(() => {
        throw new Error('localStorage is not available');
      });
      
      const result = safelyRemoveData('testKey');
      expect(result).toBe(false);
      expect(localStorageMock.removeItem).not.toHaveBeenCalled();
    });

    it('should handle errors when removing data', () => {
      // Mock localStorage.removeItem to throw an error
      localStorageMock.removeItem.mockImplementationOnce(() => {
        throw new Error('Storage error');
      });
      
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const result = safelyRemoveData('testKey');
      
      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('safelyClearAllData', () => {
    it('should clear all data from localStorage successfully', () => {
      const result = safelyClearAllData();
      expect(result).toBe(true);
      expect(localStorageMock.clear).toHaveBeenCalled();
    });

    it('should return false when localStorage is not available', () => {
      // Mock isLocalStorageAvailable to return false
      vi.spyOn(window, 'localStorage', 'get').mockImplementationOnce(() => {
        throw new Error('localStorage is not available');
      });
      
      const result = safelyClearAllData();
      expect(result).toBe(false);
      expect(localStorageMock.clear).not.toHaveBeenCalled();
    });

    it('should handle errors when clearing data', () => {
      // Mock localStorage.clear to throw an error
      localStorageMock.clear.mockImplementationOnce(() => {
        throw new Error('Storage error');
      });
      
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const result = safelyClearAllData();
      
      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});