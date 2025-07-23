import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useGradeAnalysis, getLetterGrade, formatGrade } from '../useGradeAnalysis';
import type { GradeComponent } from '../../types/models';

describe('useGradeAnalysis Hook', () => {
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

  it('should combine grade calculations and target predictions', () => {
    const targetGrade = 90;
    const { result } = renderHook(() => useGradeAnalysis(components, targetGrade));
    
    // Should include values from useGradeCalculator
    expect(result.current.currentGrade).toBeCloseTo(86.67, 1);
    expect(result.current.completedWeight).toBe(50);
    expect(result.current.remainingWeight).toBe(50);
    
    // Should include values from useTargetGradePredictor
    expect(result.current.requiredAverage).toBeCloseTo(93, 0);
    expect(result.current.isAchievable).toBe(true);
    expect(result.current.status).toBe('challenging');
    
    // Should include derived values
    expect(result.current.letterGrade).toBe('B');
    expect(result.current.targetLetterGrade).toBe('A-');
    expect(result.current.formattedCurrentGrade).toBe('86.7%');
    expect(result.current.formattedRequiredAverage).toBe('93.0%');
  });

  it('should handle empty components array', () => {
    const targetGrade = 90;
    const { result } = renderHook(() => useGradeAnalysis([], targetGrade));
    
    expect(result.current.currentGrade).toBeNull();
    expect(result.current.letterGrade).toBe('N/A');
    expect(result.current.formattedCurrentGrade).toBe('N/A');
  });

  it('should recalculate when components or target grade change', () => {
    const { result, rerender } = renderHook(
      (props) => useGradeAnalysis(props.components, props.targetGrade),
      {
        initialProps: { components, targetGrade: 90 },
      }
    );
    
    // Initial calculation
    expect(result.current.letterGrade).toBe('B');
    expect(result.current.targetLetterGrade).toBe('A-');
    
    // Update target grade
    rerender({ components, targetGrade: 80 });
    
    // Target letter grade should be updated
    expect(result.current.targetLetterGrade).toBe('B-');
    
    // Update a component score
    const updatedComponents = [...components];
    updatedComponents[0] = {
      ...updatedComponents[0],
      score: 95,
    };
    
    // Rerender with updated components
    rerender({ components: updatedComponents, targetGrade: 80 });
    
    // Letter grade should be updated
    expect(result.current.letterGrade).toBe('A-');
  });
});

describe('getLetterGrade', () => {
  it('should convert percentages to letter grades correctly', () => {
    expect(getLetterGrade(100)).toBe('A+');
    expect(getLetterGrade(95)).toBe('A');
    expect(getLetterGrade(91)).toBe('A-');
    expect(getLetterGrade(88)).toBe('B+');
    expect(getLetterGrade(85)).toBe('B');
    expect(getLetterGrade(81)).toBe('B-');
    expect(getLetterGrade(78)).toBe('C+');
    expect(getLetterGrade(75)).toBe('C');
    expect(getLetterGrade(71)).toBe('C-');
    expect(getLetterGrade(68)).toBe('D+');
    expect(getLetterGrade(65)).toBe('D');
    expect(getLetterGrade(61)).toBe('D-');
    expect(getLetterGrade(59)).toBe('F');
    expect(getLetterGrade(0)).toBe('F');
  });

  it('should handle null values', () => {
    expect(getLetterGrade(null)).toBe('N/A');
  });
});

describe('formatGrade', () => {
  it('should format grade percentages correctly', () => {
    expect(formatGrade(95)).toBe('95.0%');
    expect(formatGrade(87.5)).toBe('87.5%');
    expect(formatGrade(100)).toBe('100.0%');
    expect(formatGrade(0)).toBe('0.0%');
  });

  it('should handle null values', () => {
    expect(formatGrade(null)).toBe('N/A');
  });
});