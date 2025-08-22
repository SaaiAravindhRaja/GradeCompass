import { Course, Grade } from '../types/models';

export const mockCourses: Course[] = [
  {
    id: '1',
    name: 'Calculus I',
    code: 'MATH101',
    credits: 3,
    grades: [
      { id: 'g1', name: 'Homework 1', weight: 0.1, score: 95 },
      { id: 'g2', name: 'Quiz 1', weight: 0.1, score: 88 },
      { id: 'g3', name: 'Midterm', weight: 0.3, score: 75 },
      { id: 'g4', name: 'Homework 2', weight: 0.1, score: 92 },
      { id: 'g5', name: 'Final Exam', weight: 0.4, score: 80 },
    ],
  },
  {
    id: '2',
    name: 'Introduction to Programming',
    code: 'CS101',
    credits: 4,
    grades: [
      { id: 'g6', name: 'Assignment 1', weight: 0.2, score: 90 },
      { id: 'g7', name: 'Midterm', weight: 0.3, score: 85 },
      { id: 'g8', name: 'Assignment 2', weight: 0.2, score: 95 },
      { id: 'g9', name: 'Final Project', weight: 0.3, score: 88 },
    ],
  },
  {
    id: '3',
    name: 'English Literature',
    code: 'ENGL201',
    credits: 3,
    grades: [
      { id: 'g10', name: 'Essay 1', weight: 0.3, score: 78 },
      { id: 'g11', name: 'Midterm', weight: 0.3, score: 82 },
      { id: 'g12', name: 'Presentation', weight: 0.2, score: 90 },
      { id: 'g13', name: 'Final Paper', weight: 0.2, score: 85 },
    ],
  },
];