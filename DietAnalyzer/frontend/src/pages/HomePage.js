import React, { useEffect, useRef } from 'react';
import Hero from '../components/Hero/Hero';
import AuthForm from '../components/Auth/AuthForm';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const HomePage = () => {
  const authFormRef = useRef(null);
  const location = useLocation();

  const scrollToAuth = () => {
    authFormRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (location.state?.scrollToSignIn && authFormRef.current) {
      authFormRef.current.scrollIntoView({ behavior: 'smooth' });
      // Clean up the state so it doesn't scroll again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Main container with responsive layout */}
      <div className="flex flex-col lg:flex-row w-full">
        {/* Hero section - full width on mobile, half on desktop */}
        <div className="w-full lg:w-1/2 bg-gradient-to-br from-emerald-500 to-green-600 text-white p-4 sm:p-8 lg:p-12 min-h-screen lg:min-h-screen flex items-center justify-center relative overflow-hidden">
          {/* Decorative background circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400 rounded-full opacity-10 -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-700 rounded-full opacity-10 -ml-48 -mb-48" />
          
          <div className="max-w-xl w-full relative z-10">
            <Hero onSignUpClick={scrollToAuth} />
          </div>
        </div>

        {/* Auth form section */}
        <div 
          ref={authFormRef}
          className="w-full lg:w-1/2 p-4 sm:p-8 lg:p-12 min-h-screen lg:min-h-screen flex items-center justify-center bg-white bg-opacity-50 backdrop-blur-sm"
        >
          <div className="max-w-xl w-full">
            <AuthForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;