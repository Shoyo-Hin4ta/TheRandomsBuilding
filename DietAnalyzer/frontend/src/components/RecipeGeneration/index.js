import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChefHat, Apple, BookOpen } from 'lucide-react';

const RecipeGeneration = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 text-center text-gray-900">
          Smart Recipe Generator
        </h1>
        <p className="text-gray-600">Personalized recipes tailored just for you</p>
      </div>

      <Card className="w-full max-w-md shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardContent className="space-y-6 pt-6">
          <Button
            variant="default"
            className="w-full h-16 text-lg relative overflow-hidden group bg-black hover:bg-gray-800 transition-colors duration-300"
            onClick={() => navigate('/dietary-recipes')}
          >
            <ChefHat className="w-6 h-6 absolute left-4 group-hover:scale-110 transition-transform duration-300" />
            <span className="ml-6">Recipes Based on Dietary Needs</span>
          </Button>
          
          <Button
            variant="default"
            className="w-full h-16 text-lg relative overflow-hidden group bg-gray-900 hover:bg-gray-800 transition-colors duration-300"
            onClick={() => navigate('/ingredient-recipes')}
          >
            <Apple className="w-6 h-6 absolute left-4 group-hover:scale-110 transition-transform duration-300" />
            <span className="ml-6">Recipes Based on Available Ingredients</span>
          </Button>
          
          <Button
            variant="default"
            className="w-full h-16 text-lg relative overflow-hidden group bg-black hover:bg-gray-800 transition-colors duration-300"
            onClick={() => navigate('/all-recipes')}
          >
            <BookOpen className="w-6 h-6 absolute left-4 group-hover:scale-110 transition-transform duration-300" />
            <span className="ml-6">View All Generated Recipes</span>
          </Button>
        </CardContent>
      </Card>

      <div className="mt-6 text-sm text-gray-600 text-center">
        Discover delicious and healthy recipes customized to your preferences
      </div>
    </div>
  );
};

export default RecipeGeneration;