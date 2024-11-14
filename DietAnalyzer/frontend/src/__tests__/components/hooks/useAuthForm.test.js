import { renderHook, act } from '@testing-library/react';
import axios from 'axios';
import useAuthForm from '../../../hooks/useAuthForm';

jest.mock('axios');

describe('useAuthForm Hook', () => {
  const initialState = {
    username: '',
    password: ''
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('initializes with correct state', () => {
    const { result } = renderHook(() => useAuthForm(initialState, '/users/signin'));
    
    expect(result.current.formData).toEqual(initialState);
    expect(result.current.error).toBe('');
    expect(result.current.success).toBe('');
    expect(result.current.isLoading).toBe(false);
  });

  test('handles successful form submission', async () => {
    const mockResponse = {
      data: {
        data: { user: { username: 'testuser' } }
      }
    };
    axios.post.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useAuthForm(initialState, '/users/signin'));
    
    await act(async () => {
      await result.current.handleSubmit({ preventDefault: jest.fn() });
    });

    expect(result.current.success).toBe('Signed in successfully!');
    expect(result.current.error).toBe('');
    expect(result.current.isLoading).toBe(false);
  });
});