import { describe, it, expect } from 'vitest';
import {
  validateCourseName,
  validateComponentName,
  validateWeight,
  validateScore,
  validateTargetGrade,
  validateTotalWeight,
} from '../validation';
import { GradeComponent } from '../../types/models';

describe('Validation Utils', () => {
  describe('validateCourseName', () => {
    it('should return null for valid course names', () => {
      expect(validateCourseName('Mathematics 101')).toBeNull();
      expect(validateCourseName('Computer Science')).toBeNull();
    });

    it('should return error for empty course names', () => {
      expect(validateCourseName('')).toBe('Course name is required');
      expect(validateCourseName('   ')).toBe('Course name is required');
    });

    it('should return error for too long course names', () => {
      const longName = 'A'.repeat(101);
      expect(validateCourseName(longName)).toBe('Course name must be less than 100 characters');
    });
  });

  describe('validateComponentName', () => {
    it('should return null for valid component names', () => {
      expect(validateComponentName('Midterm Exam')).toBeNull();
      expect(validateComponentName('Final Project')).toBeNull();
    });

    it('should return error for empty component names', () => {
      expect(validateComponentName('')).toBe('Component name is required');
      expect(validateComponentName('   ')).toBe('Component name is required');
    });

    it('should return error for too long component names', () => {
      const longName = 'A'.repeat(101);
      expect(validateComponentName(longName)).toBe('Component name must be less than 100 characters');
    });
  });

  describe('validateWeight', () => {
    it('should return null for valid weights', () => {
      expect(validateWeight(10)).toBeNull();
      expect(validateWeight('25')).toBeNull();
      expect(validateWeight(0)).toBeNull();
      expect(validateWeight(100)).toBeNull();
    });

    it('should return error for non-numeric weights', () => {
      expect(validateWeight('abc')).toBe('Weight must be a number');
      expect(validateWeight('10a')).toBe('Weight must be a number');
    });

    it('should return error for negative weights', () => {
      expect(validateWeight(-10)).toBe('Weight cannot be negative');
      expect(validateWeight('-5')).toBe('Weight cannot be negative');
    });

    it('should return error for weights exceeding 100%', () => {
      expect(validateWeight(101)).toBe('Weight cannot exceed 100%');
      expect(validateWeight('150')).toBe('Weight cannot exceed 100%');
    });
  });

  describe('validateScore', () => {
    it('should return null for valid scores', () => {
      expect(validateScore(85, 100)).toBeNull();
      expect(validateScore('90', 100)).toBeNull();
      expect(validateScore(0, 100)).toBeNull();
      expect(validateScore(100, 100)).toBeNull();
      expect(validateScore(null, 100)).toBeNull();
    });

    it('should return error for non-numeric scores', () => {
      expect(validateScore('abc', 100)).toBe('Score must be a number');
      expect(validateScore('85a', 100)).toBe('Score must be a number');
    });

    it('should return error for negative scores', () => {
      expect(validateScore(-10, 100)).toBe('Score cannot be negative');
      expect(validateScore('-5', 100)).toBe('Score cannot be negative');
    });

    it('should return error for scores exceeding max score', () => {
      expect(validateScore(101, 100)).toBe('Score cannot exceed maximum score of 100');
      expect(validateScore('150', 100)).toBe('Score cannot exceed maximum score of 100');
    });
  });

  describe('validateTargetGrade', () => {
    it('should return null for valid target grades', () => {
      expect(validateTargetGrade(85)).toBeNull();
      expect(validateTargetGrade('90')).toBeNull();
      expect(validateTargetGrade(0)).toBeNull();
      expect(validateTargetGrade(100)).toBeNull();
    });

    it('should return error for non-numeric target grades', () => {
      expect(validateTargetGrade('abc')).toBe('Target grade must be a number');
      expect(validateTargetGrade('85a')).toBe('Target grade must be a number');
    });

    it('should return error for negative target grades', () => {
      expect(validateTargetGrade(-10)).toBe('Target grade cannot be negative');
      expect(validateTargetGrade('-5')).toBe('Target grade cannot be negative');
    });

    it('should return error for target grades exceeding 100%', () => {
      expect(validateTargetGrade(101)).toBe('Target grade cannot exceed 100%');
      expect(validateTargetGrade('150')).toBe('Target grade cannot exceed 100%');
    });
  });

  describe('validateTotalWeight', () => {
    it('should return null when total weight is valid', () => {
      const components: GradeComponent[] = [
        { id: '1', name: 'Midterm', weight: 30, score: 85, maxScore: 100, isCompleted: true },
        { id: '2', name: 'Final', weight: 40, score: null, maxScore: 100, isCompleted: false },
        { id: '3', name: 'Assignments', weight: 30, score: 90, maxScore: 100, isCompleted: true },
      ];
      expect(validateTotalWeight(components)).toBeNull();
    });

    it('should return error when total weight exceeds 100%', () => {
      const components: GradeComponent[] = [
        { id: '1', name: 'Midterm', weight: 40, score: 85, maxScore: 100, isCompleted: true },
        { id: '2', name: 'Final', weight: 40, score: null, maxScore: 100, isCompleted: false },
        { id: '3', name: 'Assignments', weight: 30, score: 90, maxScore: 100, isCompleted: true },
      ];
      expect(validateTotalWeight(components)).toBe('Total weight (110%) exceeds 100%');
    });
  });
});