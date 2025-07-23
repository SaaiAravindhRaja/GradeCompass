import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import StorageAlert from '../StorageAlert';
import { useCourses } from '../../contexts/CourseContext';

// Mock the useCourses hook
vi.mock('../../contexts/CourseContext', () => ({
  useCourses: vi.fn(),
}));

describe('StorageAlert', () => {
  it('should not render when localStorage is available', () => {
    vi.mocked(useCourses).mockReturnValue({
      isStorageAvailable: true,
    } as any);

    const { container } = render(<StorageAlert />);
    expect(container.firstChild).toBeNull();
  });

  it('should render alert when localStorage is not available', () => {
    vi.mocked(useCourses).mockReturnValue({
      isStorageAvailable: false,
    } as any);

    render(<StorageAlert />);
    
    expect(screen.getByText('Storage Unavailable')).toBeInTheDocument();
    expect(
      screen.getByText(/Local storage is not available in your browser/i)
    ).toBeInTheDocument();
  });
});