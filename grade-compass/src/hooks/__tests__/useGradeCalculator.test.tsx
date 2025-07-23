import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useGradeCalculator } from '../useGradeCalculator';
import type { GradeComponent } from '../../types/models';

describe('useGradeCalculator Hook', () => {
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

  it('should calculate grade statistics correctly', () => {
    const { result } = renderHook(() => useGradeCalculator(components));
    
    // Current grade: (85 * 30 + 90 * 20) / (30 + 20) = 86.67
    expect(result.current.currentGrade).toBeCloseTo(86.67, 1);
    
    // Completed weight: 30 + 20 = 50
    expect(result.current.completedWeight).toBe(50);
    
    // Remaining weight: 40 + 10 = 50
    expect(result.current.remainingWeight).toBe(50);
    
    // Is complete: false
    expect(result.current.isComplete).toBe(false);
    
    // Total weight: 30 + 40 + 20 + 10 = 100
    expect(result.current.totalWeight).toBe(100);
    
    // Weight remaining: 100 - 100 = 0
    expect(result.current.weightRemaining).toBe(0);
    
    // Is weight valid: true
    expect(result.current.isWeightValid).toBe(true);
    
    // Has components: true
    expect(result.current.hasComponents).toBe(true);
  });

  it('should handle empty components array', () => {
    const { result } = renderHook(() => useGradeCalculator([]));
    
    expect(result.current.currentGrade).toBeNull();
    expect(result.current.completedWeight).toBe(0);
    expect(result.current.remainingWeight).toBe(0);
    expect(result.current.isComplete).toBe(false);
    expect(result.current.totalWeight).toBe(0);
    expect(result.current.weightRemaining).toBe(100);
    expect(result.current.isWeightValid).toBe(true);
    expect(result.current.hasComponents).toBe(false);
  });

  it('should detect invalid weight total', () => {
    const invalidComponents: GradeComponent[] = [
      ...components,
      {
        id: '5',
        name: 'Extra Credit',
        weight: 10,
        score: null,
        maxScore: 100,
        isCompleted: false,
      },
    ];
    
    const { result } = renderHook(() => useGradeCalculator(invalidComponents));
    
    // Total weight: 30 + 40 + 20 + 10 + 10 = 110
    expect(result.current.totalWeight).toBe(110);
    
    // Is weight valid: false
    expect(result.current.isWeightValid).toBe(false);
  });

  it('should detect when all components are completed', () => {
    const completedComponents: GradeComponent[] = components.map(c => ({
      ...c,
      isCompleted: true,
      score: c.score || 80, // Provide a score for components that don't have one
    }));
    
    const { result } = renderHook(() => useGradeCalculator(completedComponents));
    
    expect(result.current.isComplete).toBe(true);
    expect(result.current.remainingWeight).toBe(0);
  });

  it('should recalculate when components change', () => {
    const { result, rerender } = renderHook(
      (props) => useGradeCalculator(props.components),
      {
        initialProps: { components },
      }
    );
    
    // Initial calculation
    expect(result.current.currentGrade).toBeCloseTo(86.67, 1);
    
    // Update a component score
    const updatedComponents = [...components];
    updatedComponents[0] = {
      ...updatedComponents[0],
      score: 95,
    };
    
    // Rerender with updated components
    rerender({ components: updatedComponents });
    
    // Current grade should be updated: (95 * 30 + 90 * 20) / (30 + 20) = 93
    expect(result.current.currentGrade).toBeCloseTo(93, 0);
  });
});