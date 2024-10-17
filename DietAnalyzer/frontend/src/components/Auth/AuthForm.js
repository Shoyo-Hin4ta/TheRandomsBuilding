import React, { useState } from 'react';
import SignUp from './SignUp';
import SignIn from './SignIn';

const AuthForm = () => {
  const [isSignUp, setIsSignUp] = useState(true);

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-3xl font-bold text-green-600 mb-6 text-center">
        {isSignUp ? 'Create Account' : 'Welcome Back'}
      </h2>
      {isSignUp ? <SignUp /> : <SignIn />}
      <button
        onClick={() => setIsSignUp(!isSignUp)}
        className="mt-4 text-green-600 hover:text-green-800 transition duration-300"
      >
        {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
      </button>
    </div>
  );
};

export default AuthForm;