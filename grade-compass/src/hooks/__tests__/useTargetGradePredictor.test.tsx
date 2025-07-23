import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTargetGradePredictor } from '../useTargetGradePredictor';
import type { GradeComponent } from '../../types/models';

describe('useTargetGradePredictor Hook', () => {
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

  it('should calculate target grade predictions correctly', () => {
    const targetGrade = 90;
    const { result } = renderHook(() => useTargetGradePredictor(components, targetGrade));
    
    // Required average: (90 - (85 * 30 + 90 * 20) / 100) / 0.5 * 100 = 93
    expect(result.current.requiredAverage).toBeCloseTo(93, 0);
    
    // Is achievable: true
    expect(result.current.isAchievable).toBe(true);
    
    // Status: challenging (since required average > 90)
    expect(result.current.status).toBe('challenging');
    
    // Should have recommendations
    expect(result.current.recommendations.length).toBeGreaterThan(0);
  });

  it('should handle impossible target grades', () => {
    const targetGrade = 99;
    const { result } = renderHook(() => useTargetGradePredictor(components, targetGrade));
    
    // Is achievable: false
    expect(result.current.isAchievable).toBe(false);
    
    // Status: impossible
    expect(result.current.status).toBe('impossible');
  });

  it('should handle on-track target grades', () => {
    const targetGrade = 80;
    const { result } = renderHook(() => useTargetGradePredictor(components, targetGrade));
    
    // Required average: (80 - (85 * 30 + 90 * 20) / 100) / 0.5 * 100 = 73
    expect(result.current.requiredAverage).toBeCloseTo(73, 0);
    
    // Is achievable: true
    expect(result.current.isAchievable).toBe(true);
    
    // Status: on-track (since required average < 70)
    expect(result.current.status).toBe('on-track');
  });

  it('should handle exceeding target grades', () => {
    const lowTargetGrade = 70;
    const { result } = renderHook(() => useTargetGradePredictor(components, lowTargetGrade));
    
    // Status: exceeding (since current points > target points)
    expect(result.current.status).toBe('exceeding');
  });

  it('should handle empty components array', () => {
    const targetGrade = 90;
    const { result } = renderHook(() => useTargetGradePredictor([], targetGrade));
    
    expect(result.current.requiredAverage).toBeNull();
    expect(result.current.isAchievable).toBe(false);
    expect(result.current.recommendations.length).toBeGreaterThan(0);
  });

  it('should handle all completed components', () => {
    const targetGrade = 90;
    const completedComponents: GradeComponent[] = components.map(c => ({
      ...c,
      isCompleted: true,
      score: c.score || 80, // Provide a score for components that don't have one
    }));
    
    const { result } = renderHook(() => useTargetGradePredictor(completedComponents, targetGrade));
    
    expect(result.current.requiredAverage).toBeNull();
    
    // With the given scores, the final grade would be around 83.5, which is below the target of 90
    expect(result.current.isAchievable).toBe(false);
  });

  it('should recalculate when components or target grade change', () => {
    const { result, rerender } = renderHook(
      (props) => useTargetGradePredictor(props.components, props.targetGrade),
      {
        initialProps: { components, targetGrade: 90 },
      }
    );
    
    // Initial calculation
    expect(result.current.requiredAverage).toBeCloseTo(93, 0);
    
    // Update target grade
    rerender({ components, targetGrade: 80 });
    
    // Required average should be updated
    expect(result.current.requiredAverage).toBeCloseTo(73, 0);
    
    // Update a component score
    const updatedComponents = [...components];
    updatedComponents[0] = {
      ...updatedComponents[0],
      score: 95,
    };
    
    // Rerender with updated components
    rerender({ components: updatedComponents, targetGrade: 80 });
    
    // Required average should be updated again
    expect(result.current.requiredAverage).toBeCloseTo(67, 0);
  });
});