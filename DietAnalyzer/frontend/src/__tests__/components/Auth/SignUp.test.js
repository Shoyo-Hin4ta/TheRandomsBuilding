import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SignUp from '../../../components/Auth/SignUp';
import axios from 'axios';

jest.mock('axios');

describe('SignUp Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders all input fields and button', () => {
    render(<SignUp />);
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Last Name')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  test('updates form values on input change', () => {
    render(<SignUp />);
    
    const inputs = {
      username: screen.getByPlaceholderText('Username'),
      email: screen.getByPlaceholderText('Email'),
      password: screen.getByPlaceholderText('Password'),
      firstName: screen.getByPlaceholderText('First Name'),
      lastName: screen.getByPlaceholderText('Last Name')
    };

    const testValues = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe'
    };

    Object.keys(inputs).forEach(key => {
      fireEvent.change(inputs[key], { target: { name: key, value: testValues[key] } });
      expect(inputs[key].value).toBe(testValues[key]);
    });
  });

  test('handles successful sign up', async () => {
    axios.post.mockResolvedValueOnce({ data: {} });

    render(<SignUp />);
    
    const testValues = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe'
    };

    Object.keys(testValues).forEach(key => {
      const input = screen.getByPlaceholderText(key === 'email' ? 'Email' : 
                                              key === 'firstName' ? 'First Name' :
                                              key === 'lastName' ? 'Last Name' :
                                              key === 'password' ? 'Password' : 'Username');
      fireEvent.change(input, { target: { name: key, value: testValues[key] } });
    });

    const submitButton = screen.getByRole('button', { name: /create account/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Account created successfully! You can now sign in.')).toBeInTheDocument();
    });

    expect(axios.post).toHaveBeenCalledWith(
      `${process.env.REACT_APP_API_BASE_URL}/users/signup`,
      testValues
    );

    // Verify form reset
    Object.keys(testValues).forEach(key => {
      const input = screen.getByPlaceholderText(key === 'email' ? 'Email' : 
                                              key === 'firstName' ? 'First Name' :
                                              key === 'lastName' ? 'Last Name' :
                                              key === 'password' ? 'Password' : 'Username');
      expect(input.value).toBe('');
    });
  });

  test('handles sign up error', async () => {
    const errorMessage = 'Username already exists';
    axios.post.mockRejectedValueOnce({
      response: { data: { message: errorMessage } }
    });

    render(<SignUp />);
    
    const submitButton = screen.getByRole('button', { name: /create account/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
});