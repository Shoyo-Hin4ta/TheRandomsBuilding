import React from 'react';

const Hero = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-6">Track Your Meals, Boost Your Health</h1>
      <p className="text-xl mb-8">Snap a photo, get nutritional insights, and receive personalized recipe recommendations!</p>
      <ul className="text-left list-disc list-inside mb-8">
        <li>Easy meal logging with image recognition</li>
        <li>Personalized recipe suggestions</li>
        <li>Track your nutritional intake</li>
        <li>Make informed, healthier food choices</li>
      </ul>
      <button className="bg-white text-green-600 font-bold py-2 px-4 rounded-full hover:bg-green-100 transition duration-300">
        Learn More
      </button>
    </div>
  );
};

export default Hero;