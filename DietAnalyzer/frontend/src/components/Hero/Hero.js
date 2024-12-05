import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CalendarDays, Camera, Salad, Brain } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="flex gap-4 p-4 rounded-lg hover:bg-white/5 transition-colors">
    <div className="mt-1">
      <Icon className="h-6 w-6 text-emerald-300" />
    </div>
    <div>
      <h3 className="font-semibold text-lg text-emerald-100 mb-1">{title}</h3>
      <p className="text-emerald-50/90 text-sm">{description}</p>
    </div>
  </div>
);

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
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-white/10 backdrop-blur-sm text-white border-2 border-white/20 hover:bg-white/20 font-semibold rounded-xl px-8 py-6 text-lg transition-all duration-300 hover:scale-105">
              Learn More
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-emerald-900/95 backdrop-blur-lg border-emerald-800">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-emerald-100 mb-6">
                Revolutionize Your Diet Journey
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-6">
              <FeatureCard
                icon={Camera}
                title="Smart Meal Tracking"
                description="Simply take a photo of your meal and our AI technology will analyze its contents, providing detailed nutritional information instantly."
              />
              <FeatureCard
                icon={Brain}
                title="AI-Powered Recommendations"
                description="Get personalized recipe suggestions based on your dietary preferences, health goals, and previous meal choices."
              />
              <FeatureCard
                icon={CalendarDays}
                title="Comprehensive Progress Tracking"
                description="Monitor your nutritional intake over time with detailed analytics and visualizations of your dietary patterns."
              />
              <FeatureCard
                icon={Salad}
                title="Recipe Generation"
                description="Discover new healthy recipes tailored to your preferences and available ingredients in your pantry."
              />
            </div>
          </DialogContent>
        </Dialog>
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