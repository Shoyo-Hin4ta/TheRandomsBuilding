import { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setUser, setError, setLoading } from '../store/slice/userSlice';

const useAuthForm = (initialState, endpoint) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(initialState);
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (dispatch) {
      dispatch(setError(null));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setError(null));
    setSuccess('');
    dispatch(setLoading(true));

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}${endpoint}`,
        formData
      );

      if (endpoint === '/users/signin') {
        const { user, accessToken } = response.data.data;
        dispatch(setUser({ user, accessToken }));
        setSuccess('Sign in successful! Redirecting...');
      } else {
        setSuccess(response.data.message || 'Account created successfully! You can now sign in.');
      }

      setFormData(initialState);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Something went wrong. Please try again.';
      dispatch(setError(errorMessage));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    formData,
    success,
    handleChange,
    handleSubmit
  };
};

export default useAuthForm;