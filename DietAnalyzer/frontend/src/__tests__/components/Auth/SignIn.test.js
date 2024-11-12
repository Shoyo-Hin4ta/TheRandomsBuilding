import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SignIn from '../../../components/Auth/SignIn';
import axios from 'axios';

jest.mock('axios');

describe('SignIn Component (Refactored)', () => {
  test('handles successful signin', async () => {
    axios.post.mockResolvedValueOnce({
      data: {
        data: { user: { username: 'testuser' } }
      }
    });

    render(<SignIn />);
    
    const usernameInput = screen.getByPlaceholderText('Enter Username');
    const passwordInput = screen.getByPlaceholderText('Password');
    
    fireEvent.change(usernameInput, {
      target: { name: 'username', value: 'testuser' }
    });
    fireEvent.change(passwordInput, {
      target: { name: 'password', value: 'password123' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText('Signed in successfully!')).toBeInTheDocument();
    });
  });

  test('shows loading state during submission', async () => {
    axios.post.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(<SignIn />);
    
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(screen.getByText('Signing in...')).toBeInTheDocument();
  });
});