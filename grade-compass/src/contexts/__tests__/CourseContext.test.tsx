import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { CourseProvider, useCourses } from '../CourseContext';
import * as courseStorage from '../../services/courseStorage';

// Mock the courseStorage module
vi.mock('../../services/courseStorage', () => ({
  getCourses: vi.fn(),
  getActiveCourseId: vi.fn(),
  saveActiveCourseId: vi.fn(),
  addCourse: vi.fn(),
  updateCourse: vi.fn(),
  deleteCourse: vi.fn(),
  clearAllCourseData: vi.fn(),
  isCourseStorageAvailable: vi.fn(),
  createComponent: vi.fn(),
}));

// Test component that uses the CourseContext
const TestComponent = () => {
  const {
    courses,
    activeCourseId,
    activeCourse,
    isStorageAvailable,
    addCourse,
    updateCourse,
    deleteCourse,
    setActiveCourseId,
    clearAllData,
    addComponent,
    updateComponent,
    deleteComponent,
  } = useCourses();

  return (
    <div>
      <div data-testid="courses-count">{courses.length}</div>
      <div data-testid="active-course-id">{activeCourseId || 'none'}</div>
      <div data-testid="active-course-name">{activeCourse?.name || 'none'}</div>
      <div data-testid="storage-available">{isStorageAvailable.toString()}</div>
      <button
        data-testid="add-course"
        onClick={() => addCourse('New Course')}
      >
        Add Course
      </button>
      <button
        data-testid="update-course"
        onClick={() => {
          if (activeCourse) {
            updateCourse({
              ...activeCourse,
              name: 'Updated Course',
            });
          }
        }}
      >
        Update Course
      </button>
      <button
        data-testid="delete-course"
        onClick={() => {
          if (activeCourseId) {
            deleteCourse(activeCourseId);
          }
        }}
      >
        Delete Course
      </button>
      <button
        data-testid="set-active-course"
        onClick={() => {
          if (courses.length > 0) {
            setActiveCourseId(courses[0].id);
          }
        }}
      >
        Set Active Course
      </button>
      <button data-testid="clear-data" onClick={() => clearAllData()}>
        Clear Data
      </button>
      <button
        data-testid="add-component"
        onClick={() => addComponent('New Component', 10)}
      >
        Add Component
      </button>
      <button
        data-testid="update-component"
        onClick={() => {
          if (activeCourse && activeCourse.components.length > 0) {
            updateComponent(activeCourse.components[0].id, { name: 'Updated Component' });
          }
        }}
      >
        Update Component
      </button>
      <button
        data-testid="delete-component"
        onClick={() => {
          if (activeCourse && activeCourse.components.length > 0) {
            deleteComponent(activeCourse.components[0].id);
          }
        }}
      >
        Delete Component
      </button>
    </div>
  );
};

describe('CourseContext', () => {
  const mockCourses = [
    {
      id: 'course-1',
      name: 'Course 1',
      components: [
        {
          id: 'component-1',
          name: 'Component 1',
          weight: 30,
          score: null,
          maxScore: 100,
          isCompleted: false,
        },
      ],
      targetGrade: 90,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    },
    {
      id: 'course-2',
      name: 'Course 2',
      components: [],
      targetGrade: 85,
      createdAt: new Date('2023-01-02'),
      updatedAt: new Date('2023-01-02'),
    },
  ];

  beforeEach(() => {
    vi.resetAllMocks();
    
    // Default mock implementations
    vi.mocked(courseStorage.getCourses).mockReturnValue(mockCourses);
    vi.mocked(courseStorage.getActiveCourseId).mockReturnValue('course-1');
    vi.mocked(courseStorage.isCourseStorageAvailable).mockReturnValue(true);
    vi.mocked(courseStorage.addCourse).mockReturnValue({
      course: {
        id: 'new-course',
        name: 'New Course',
        components: [],
        targetGrade: 90,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      success: true,
    });
    vi.mocked(courseStorage.updateCourse).mockReturnValue(true);
    vi.mocked(courseStorage.deleteCourse).mockReturnValue(true);
    vi.mocked(courseStorage.clearAllCourseData).mockReturnValue(true);
    vi.mocked(courseStorage.createComponent).mockReturnValue({
      id: 'new-component',
      name: 'New Component',
      weight: 10,
      score: null,
      maxScore: 100,
      isCompleted: false,
    });
  });

  it('should initialize with data from localStorage', () => {
    render(
      <CourseProvider>
        <TestComponent />
      </CourseProvider>
    );
    
    expect(courseStorage.getCourses).toHaveBeenCalled();
    expect(courseStorage.getActiveCourseId).toHaveBeenCalled();
    expect(courseStorage.isCourseStorageAvailable).toHaveBeenCalled();
    
    expect(screen.getByTestId('courses-count').textContent).toBe('2');
    expect(screen.getByTestId('active-course-id').textContent).toBe('course-1');
    expect(screen.getByTestId('active-course-name').textContent).toBe('Course 1');
    expect(screen.getByTestId('storage-available').textContent).toBe('true');
  });

  it('should handle adding a course', () => {
    render(
      <CourseProvider>
        <TestComponent />
      </CourseProvider>
    );
    
    act(() => {
      screen.getByTestId('add-course').click();
    });
    
    expect(courseStorage.addCourse).toHaveBeenCalledWith('New Course');
    expect(screen.getByTestId('courses-count').textContent).toBe('3');
  });

  it('should handle updating a course', () => {
    render(
      <CourseProvider>
        <TestComponent />
      </CourseProvider>
    );
    
    act(() => {
      screen.getByTestId('update-course').click();
    });
    
    expect(courseStorage.updateCourse).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'course-1',
        name: 'Updated Course',
      })
    );
  });

  it('should handle deleting a course', () => {
    render(
      <CourseProvider>
        <TestComponent />
      </CourseProvider>
    );
    
    act(() => {
      screen.getByTestId('delete-course').click();
    });
    
    expect(courseStorage.deleteCourse).toHaveBeenCalledWith('course-1');
  });

  it('should handle setting the active course', () => {
    render(
      <CourseProvider>
        <TestComponent />
      </CourseProvider>
    );
    
    act(() => {
      screen.getByTestId('set-active-course').click();
    });
    
    expect(courseStorage.saveActiveCourseId).toHaveBeenCalledWith('course-1');
  });

  it('should handle clearing all data', () => {
    render(
      <CourseProvider>
        <TestComponent />
      </CourseProvider>
    );
    
    act(() => {
      screen.getByTestId('clear-data').click();
    });
    
    expect(courseStorage.clearAllCourseData).toHaveBeenCalled();
    expect(screen.getByTestId('courses-count').textContent).toBe('0');
    expect(screen.getByTestId('active-course-id').textContent).toBe('none');
  });

  it('should handle adding a component', () => {
    render(
      <CourseProvider>
        <TestComponent />
      </CourseProvider>
    );
    
    act(() => {
      screen.getByTestId('add-component').click();
    });
    
    expect(courseStorage.createComponent).toHaveBeenCalledWith('New Component', 10);
    expect(courseStorage.updateCourse).toHaveBeenCalled();
  });

  it('should handle updating a component', () => {
    render(
      <CourseProvider>
        <TestComponent />
      </CourseProvider>
    );
    
    act(() => {
      screen.getByTestId('update-component').click();
    });
    
    expect(courseStorage.updateCourse).toHaveBeenCalledWith(
      expect.objectContaining({
        components: expect.arrayContaining([
          expect.objectContaining({
            id: 'component-1',
            name: 'Updated Component',
          }),
        ]),
      })
    );
  });

  it('should handle deleting a component', () => {
    render(
      <CourseProvider>
        <TestComponent />
      </CourseProvider>
    );
    
    act(() => {
      screen.getByTestId('delete-component').click();
    });
    
    expect(courseStorage.updateCourse).toHaveBeenCalledWith(
      expect.objectContaining({
        components: [],
      })
    );
  });

  it('should handle localStorage unavailability', () => {
    vi.mocked(courseStorage.isCourseStorageAvailable).mockReturnValue(false);
    
    render(
      <CourseProvider>
        <TestComponent />
      </CourseProvider>
    );
    
    expect(screen.getByTestId('storage-available').textContent).toBe('false');
  });
});