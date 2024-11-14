import React from 'react';
import Hero from '../components/Hero/Hero';
import AuthForm from '../components/Auth/AuthForm';
import MealLogging from '@/components/MealLogging';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const HomePage = () => {

  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-green-50 items-center">
      {/* <div className="w-1/2 bg-green-600 flex items-center justify-center text-white p-12">
        <Hero />
      </div>
      <div className="w-1/2 flex items-center justify-center p-12">
        <AuthForm />
      </div> */}
      <MealLogging />
      <Button 
            className='w-1/2'
            onClick={() => navigate('/recipe-generation')}
          >
            Go to Recipe Generation
          </Button>
    </div>
  );
};

export default HomePage;