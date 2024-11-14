import React from 'react';
import Hero from '../components/Hero/Hero';
import AuthForm from '../components/Auth/AuthForm';
import MealLogging from '@/components/MealLogging';

const HomePage = () => {
  return (
    <div className="flex min-h-screen bg-green-50">
      {/* <div className="w-1/2 bg-green-600 flex items-center justify-center text-white p-12">
        <Hero />
      </div>
      <div className="w-1/2 flex items-center justify-center p-12">
        <AuthForm />
      </div> */}
      <MealLogging />
    </div>
  );
};

export default HomePage;