import React from 'react';
import useAuthForm from '../../hooks/useAuthForm';

const SignIn = () => {
  const initialState = {
    username: '',
    password: ''
  };

  const {
    formData,
    error,
    success,
    isLoading,
    handleChange,
    handleSubmit
  } = useAuthForm(initialState, '/users/signin');

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-green-600 text-sm">{success}</p>}
      <div>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Enter Username"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      <button 
        type="submit" 
        className="w-full px-4 py-2 text-white bg-green-600 rounded-md"
        disabled={isLoading}
      >
        {isLoading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
};

export default SignIn;