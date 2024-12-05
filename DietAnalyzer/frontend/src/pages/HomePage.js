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
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      <div className="flex flex-col lg:flex-row w-full">
        {/* Hero section */}
        <div className="w-full lg:w-1/2 bg-gradient-to-br from-emerald-600 to-teal-600 text-white p-8 sm:p-12 lg:p-16 min-h-screen flex items-center justify-center relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-teal-500/20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
            <div className="absolute top-1/2 left-1/2 w-[30rem] h-[30rem] bg-emerald-400/10 rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          
          {/* Content */}
          <div className="max-w-2xl w-full relative z-10">
            <Hero onSignUpClick={scrollToAuth} />
          </div>
        </div>

        {/* Auth form section */}
        <div 
          ref={authFormRef}
          className="w-full lg:w-1/2 p-8 sm:p-12 lg:p-16 min-h-screen flex items-center justify-center bg-white/70 backdrop-blur-md"
        >
          <div className="max-w-xl w-full relative">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100 rounded-full blur-3xl opacity-50 -z-10" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-100 rounded-full blur-3xl opacity-50 -z-10" />
            
            <AuthForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;