import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useAuthForm from '../../hooks/useAuthForm';
import { selectError, selectLoading } from '../../store/slice/userSlice';

// SignIn Component
const SignIn = () => {
  const navigate = useNavigate();
  const error = useSelector(selectError);
  const loading = useSelector(selectLoading);
  const isAuthenticated = useSelector(state => state.user.isAuthenticated);
  
  const initialState = {
    username: '',
    password: ''
  };

  const { formData, success, handleChange, handleSubmit } = useAuthForm(initialState, '/users/signin');

  useEffect(() => {
    if (isAuthenticated) {
      const timer = setTimeout(() => {
        navigate('/meal-logging');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl w-full max-w-md mx-auto">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-8 text-center">
        Welcome Back
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm" role="alert">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-emerald-50/80 backdrop-blur-sm border border-emerald-200 text-emerald-600 px-4 py-3 rounded-xl text-sm" role="alert">
            {success}
          </div>
        )}
        <div className="space-y-4">
          <div>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter Username"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
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
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
              required
            />
          </div>
        </div>
        <button 
          type="submit" 
          className="w-full px-6 py-3 text-white bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg"
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
};

export default SignIn;