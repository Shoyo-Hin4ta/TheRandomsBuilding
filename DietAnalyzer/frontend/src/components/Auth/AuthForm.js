import React, { useState } from 'react';
import SignUp from './SignUp';
import SignIn from './SignIn';


const AuthForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="relative">
        {isSignUp ? <SignUp /> : <SignIn />}
        <div className="mt-8 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-emerald-600 hover:text-emerald-800 transition duration-300 text-sm font-medium hover:underline decoration-2 underline-offset-4"
          >
            {isSignUp 
              ? 'Already have an account? Sign In' 
              : 'Need an account? Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;