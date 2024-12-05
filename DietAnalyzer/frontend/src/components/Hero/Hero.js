import React from 'react';
import { Button } from '@/components/ui/button';

const Hero = ({ onSignUpClick }) => {
  return (
    <div className="text-center relative z-10">
      <div className="mb-12">
        <h1 className="text-5xl sm:text-6xl font-bold mb-6 leading-tight text-white">
          Track Your Meals, <br className="hidden sm:block" />
          <span className="text-emerald-100">Boost Your Health</span>
        </h1>
        <p className="text-xl mb-8 text-emerald-50 opacity-90">
          Snap a photo, get nutritional insights, and receive personalized recipe recommendations!
        </p>
      </div>

      <ul className="text-left list-none space-y-4 mb-12 text-emerald-50 max-w-md mx-auto">
        {[
          'Easy meal logging with image recognition',
          'Personalized recipe suggestions',
          'Track your nutritional intake',
          'Make informed, healthier food choices'
        ].map((item, index) => (
          <li key={index} className="flex items-center transform hover:translate-x-2 transition-transform duration-300">
            <span className="mr-3 text-emerald-300">⬢</span>
            <span className="text-lg">{item}</span>
          </li>
        ))}
      </ul>

      <div className="flex flex-col sm:flex-row gap-6 justify-center">
        <Button 
          className="bg-white/10 backdrop-blur-sm text-white border-2 border-white/20 hover:bg-white/20 font-semibold rounded-xl px-8 py-6 text-lg transition-all duration-300 hover:scale-105"
        >
          Learn More
        </Button>
        <Button 
          onClick={onSignUpClick}
          className="bg-emerald-100 text-emerald-800 hover:bg-white font-semibold rounded-xl px-8 py-6 text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
        >
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default Hero;