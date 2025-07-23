import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../useLocalStorage';

describe('useLocalStorage Hook', () => {
  // Mock localStorage
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

  it('should initialize with the default value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'defaultValue'));
    expect(result.current[0]).toBe('defaultValue');
    expect(localStorageMock.getItem).toHaveBeenCalledWith('testKey');
  });

  it('should initialize with the value from localStorage if it exists', () => {
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify('storedValue'));
    
    const { result } = renderHook(() => useLocalStorage('testKey', 'defaultValue'));
    expect(result.current[0]).toBe('storedValue');
  });

  it('should update the value and localStorage when setValue is called', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'defaultValue'));
    
    act(() => {
      result.current[1]('newValue');
    });
    
    expect(result.current[0]).toBe('newValue');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('testKey', JSON.stringify('newValue'));
  });

  it('should handle function updates correctly', () => {
    const { result } = renderHook(() => useLocalStorage<number>('testKey', 0));
    
    act(() => {
      result.current[1]((prev) => prev + 1);
    });
    
    expect(result.current[0]).toBe(1);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('testKey', JSON.stringify(1));
  });

  it('should handle localStorage errors gracefully', () => {
    // Mock console.error to prevent test output noise
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Mock localStorage.getItem to throw an error
    localStorageMock.getItem.mockImplementationOnce(() => {
      throw new Error('localStorage error');
    });
    
    const { result } = renderHook(() => useLocalStorage('testKey', 'defaultValue'));
    expect(result.current[0]).toBe('defaultValue');
    expect(consoleSpy).toHaveBeenCalled();
    
    // Mock localStorage.setItem to throw an error
    localStorageMock.setItem.mockImplementationOnce(() => {
      throw new Error('localStorage error');
    });
    
    act(() => {
      result.current[1]('newValue');
    });
    
    expect(consoleSpy).toHaveBeenCalledTimes(2);
    consoleSpy.mockRestore();
  });

  it('should update state when storage event occurs', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'defaultValue'));
    
    // Simulate storage event from another tab
    const storageEvent = new StorageEvent('storage', {
      key: 'testKey',
      newValue: JSON.stringify('updatedFromAnotherTab'),
    });
    
    act(() => {
      window.dispatchEvent(storageEvent);
    });
    
    expect(result.current[0]).toBe('updatedFromAnotherTab');
  });

  it('should ignore storage events for different keys', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'defaultValue'));
    
    // Simulate storage event from another tab with a different key
    const storageEvent = new StorageEvent('storage', {
      key: 'differentKey',
      newValue: JSON.stringify('updatedFromAnotherTab'),
    });
    
    act(() => {
      window.dispatchEvent(storageEvent);
    });
    
    expect(result.current[0]).toBe('defaultValue');
  });

  it('should handle invalid JSON in storage events', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    const { result } = renderHook(() => useLocalStorage('testKey', 'defaultValue'));
    
    // Simulate storage event with invalid JSON
    const storageEvent = new StorageEvent('storage', {
      key: 'testKey',
      newValue: 'invalid-json',
    });
    
    act(() => {
      window.dispatchEvent(storageEvent);
    });
    
    expect(result.current[0]).toBe('defaultValue');
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('should handle null newValue in storage events', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'defaultValue'));
    
    // Simulate storage event with null newValue (item was removed)
    const storageEvent = new StorageEvent('storage', {
      key: 'testKey',
      newValue: null,
    });
    
    act(() => {
      window.dispatchEvent(storageEvent);
    });
    
    // Value should remain unchanged when newValue is null
    expect(result.current[0]).toBe('defaultValue');
  });
});