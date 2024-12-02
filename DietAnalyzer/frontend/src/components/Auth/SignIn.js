import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useAuthForm from '../../hooks/useAuthForm';

const SignIn = () => {
  const navigate = useNavigate();
  const { error, loading } = useSelector(state => state.user);
  
  const initialState = {
    username: '',
    password: ''
  };

  const {
    formData,
    success,
    handleChange,
    handleSubmit
  } = useAuthForm(initialState, '/users/signin');

  React.useEffect(() => {
    if (success) {
      setTimeout(() => {
        navigate('/meal-logging');
      }, 1500);
    }
  }, [success, navigate]);

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-auto">
      <h2 className="text-3xl font-bold text-green-600 mb-6 text-center">
        Welcome Back
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {success && <p className="text-green-600 text-sm text-center">{success}</p>}
        <div>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter Username"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        <div>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        <button 
          type="submit" 
          className="w-full px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
};

export default SignIn;