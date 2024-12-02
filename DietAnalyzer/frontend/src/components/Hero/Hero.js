import React from 'react';
import { Button } from '@/components/ui/button';

const Hero = ({ onSignUpClick }) => {
  return (
    <div className="text-center">
      <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
        Track Your Meals, <br className="hidden sm:block" />
        Boost Your Health
      </h1>
      <p className="text-xl mb-8 text-emerald-50">
        Snap a photo, get nutritional insights, and receive personalized recipe recommendations!
      </p>
      <ul className="text-left list-none space-y-3 mb-8 text-emerald-50">
        <li className="flex items-center">
          <span className="mr-2">✦</span>
          Easy meal logging with image recognition
        </li>
        <li className="flex items-center">
          <span className="mr-2">✦</span>
          Personalized recipe suggestions
        </li>
        <li className="flex items-center">
          <span className="mr-2">✦</span>
          Track your nutritional intake
        </li>
        <li className="flex items-center">
          <span className="mr-2">✦</span>
          Make informed, healthier food choices
        </li>
      </ul>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button 
          className="bg-white text-emerald-600 hover:bg-emerald-50 font-semibold rounded-full px-8 py-2"
        >
          Learn More
        </Button>
        <Button 
          onClick={onSignUpClick}
          className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-full px-8 py-2"
        >
          Sign In
        </Button>
      </div>
    </div>
  );
};

export default Hero;