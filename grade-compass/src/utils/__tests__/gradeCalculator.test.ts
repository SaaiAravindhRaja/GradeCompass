import { describe, it, expect } from 'vitest';
import {
  calculateCurrentGrade,
  calculateCompletedWeight,
  calculateRemainingWeight,
  isAllComponentsCompleted,
  calculateRequiredAverage,
  isTargetAchievable,
} from '../gradeCalculator';
import { GradeComponent } from '../../types/models';

describe('Grade Calculator', () => {
  // Sample grade components for testing
  const components: GradeComponent[] = [
    {
      id: '1',
      name: 'Midterm',
      weight: 30,
      score: 85,
      maxScore: 100,
      isCompleted: true,
    },
    {
      id: '2',
      name: 'Final Exam',
      weight: 40,
      score: null,
      maxScore: 100,
      isCompleted: false,
    },
    {
      id: '3',
      name: 'Assignments',
      weight: 20,
      score: 90,
      maxScore: 100,
      isCompleted: true,
    },
    {
      id: '4',
      name: 'Participation',
      weight: 10,
      score: null,
      maxScore: 100,
      isCompleted: false,
    },
  ];

  describe('calculateCurrentGrade', () => {
    it('should calculate the current grade correctly', () => {
      const result = calculateCurrentGrade(components);
      // (85 * 30 + 90 * 20) / (30 + 20) = 86.67
      expect(result).toBeCloseTo(86.67, 1);
    });

    it('should return null when no components are completed', () => {
      const emptyComponents: GradeComponent[] = [];
      expect(calculateCurrentGrade(emptyComponents)).toBeNull();
    });
  });

  describe('calculateCompletedWeight', () => {
    it('should calculate the completed weight correctly', () => {
      const result = calculateCompletedWeight(components);
      // 30 + 20 = 50
      expect(result).toBe(50);
    });

    it('should return 0 when no components are completed', () => {
      const noCompletedComponents: GradeComponent[] = components.map(c => ({
        ...c,
        isCompleted: false,
      }));
      expect(calculateCompletedWeight(noCompletedComponents)).toBe(0);
    });
  });

  describe('calculateRemainingWeight', () => {
    it('should calculate the remaining weight correctly', () => {
      const result = calculateRemainingWeight(components);
      // 40 + 10 = 50
      expect(result).toBe(50);
    });

    it('should return 0 when all components are completed', () => {
      const allCompletedComponents: GradeComponent[] = components.map(c => ({
        ...c,
        isCompleted: true,
      }));
      expect(calculateRemainingWeight(allCompletedComponents)).toBe(0);
    });
  });

  describe('isAllComponentsCompleted', () => {
    it('should return false when not all components are completed', () => {
      expect(isAllComponentsCompleted(components)).toBe(false);
    });

    it('should return true when all components are completed', () => {
      const allCompletedComponents: GradeComponent[] = components.map(c => ({
        ...c,
        isCompleted: true,
      }));
      expect(isAllComponentsCompleted(allCompletedComponents)).toBe(true);
    });

    it('should return false for empty components array', () => {
      expect(isAllComponentsCompleted([])).toBe(false);
    });
  });

  describe('calculateRequiredAverage', () => {
    it('should calculate the required average correctly', () => {
      const targetGrade = 90;
      const result = calculateRequiredAverage(components, targetGrade);
      // Target: 90% of 100 = 90 points
      // Current: (85 * 30 + 90 * 20) / 100 = 43.5 points
      // Remaining: 90 - 43.5 = 46.5 points needed from 50% weight
      // Required average: (46.5 / 50) * 100 = 93%
      expect(result).toBeCloseTo(93, 0);
    });

    it('should return null when no remaining components', () => {
      const allCompletedComponents: GradeComponent[] = components.map(c => ({
        ...c,
        isCompleted: true,
      }));
      expect(calculateRequiredAverage(allCompletedComponents, 90)).toBeNull();
    });
  });

  describe('isTargetAchievable', () => {
    it('should return true when target is achievable', () => {
      expect(isTargetAchievable(components, 90)).toBe(true);
    });

    it('should return false when target is not achievable', () => {
      expect(isTargetAchievable(components, 99)).toBe(false);
    });

    it('should check current grade when all components are completed', () => {
      const allCompletedComponents: GradeComponent[] = [
        {
          id: '1',
          name: 'Midterm',
          weight: 50,
          score: 95,
          maxScore: 100,
          isCompleted: true,
        },
        {
          id: '2',
          name: 'Final',
          weight: 50,
          score: 85,
          maxScore: 100,
          isCompleted: true,
        },
      ];
      
      // Current grade is 90%
      expect(isTargetAchievable(allCompletedComponents, 85)).toBe(true);
      expect(isTargetAchievable(allCompletedComponents, 95)).toBe(false);
    });
  });
});