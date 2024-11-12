import { useState } from 'react';
import axios from 'axios';

const useAuthForm = (initialState, endpoint) => {
  const [formData, setFormData] = useState(initialState);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}${endpoint}`,
        formData,
        { withCredentials: endpoint === '/users/signin' }
      );
      
      setSuccess(
        endpoint === '/users/signin'
          ? 'Signed in successfully!'
          : 'Account created successfully! You can now sign in.'
      );

      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    error,
    success,
    isLoading,
    handleChange,
    handleSubmit
  };
};

export default useAuthForm;