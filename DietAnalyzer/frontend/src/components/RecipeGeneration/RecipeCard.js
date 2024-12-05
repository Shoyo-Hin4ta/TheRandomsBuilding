import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Scroll, Cookie, CircleDot, Sandwich } from "lucide-react";

// Separate component for nutritional info
const NutritionalInfo = ({ info }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold flex items-center gap-2 text-emerald-800">
      <Sandwich className="h-5 w-5 text-emerald-600" />
      Nutritional Information
    </h3>
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {[
        { label: 'Calories', value: info.calories },
        { label: 'Protein', value: info.protein },
        { label: 'Carbs', value: info.carbs },
        { label: 'Fat', value: info.fat },
        { label: 'Serving Size', value: info.servingSize }
      ].map(({ label, value }) => (
        <div key={label} className="bg-emerald-50/50 p-3 rounded-lg text-center">
          <div className="text-sm text-emerald-600">{label}</div>
          <div className="font-semibold text-emerald-700">{value}</div>
        </div>
      ))}
    </div>
  </div>
);

// Updated Additional Ingredients component to handle string format
const AdditionalIngredients = ({ ingredients }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold flex items-center gap-2 text-emerald-800">
      <Cookie className="h-5 w-5 text-emerald-600" />
      Additional Ingredients Needed
    </h3>
    <div className="bg-emerald-50/50 rounded-xl p-6 backdrop-blur-sm">
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ingredients.map((ingredient, index) => (
          <li 
            key={index} 
            className="flex items-center gap-2 p-3 bg-white/50 rounded-lg"
          >
            <CircleDot className="h-4 w-4 flex-shrink-0 text-emerald-500" />
            <span className="text-emerald-700">{ingredient}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const RecipeCard = ({ recipes, preferences }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % recipes.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + recipes.length) % recipes.length);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      handlePrevious();
    } else if (e.key === 'ArrowRight') {
      handleNext();
    }
  };

  if (!recipes?.length) {
    return (
      <Card className="mt-8 bg-white/80 backdrop-blur-sm border-emerald-100 shadow-lg">
        <CardContent className="p-8">
          <div className="text-center text-emerald-600" role="alert">
            No recipes available
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentRecipe = recipes[currentIndex];

  const formatDirections = (directions) => {
    // First, handle escaped newlines and clean up the input
    const cleanedDirections = directions
      .replace(/\\n/g, '\n')
      .replace(/\n\n+/g, '\n')  // Replace multiple newlines with single newline
      .trim();
  
    // Split into steps and clean them
    return cleanedDirections
      .split(/\n/)
      .filter(step => step.trim())
      .map((step, index) => {
        // Remove any existing numbers and dots at the start
        const cleanStep = step
          .replace(/^\d+[\.\)]\s*/, '')  // Remove numbers with dots or parentheses
          .trim();
        return `${index + 1}. ${cleanStep}`;
      });
  };

  return (
    <Card 
      className="mt-8 bg-white/80 backdrop-blur-sm border-emerald-100 shadow-lg hover:shadow-xl transition-all duration-300"
      onKeyDown={handleKeyDown}
      tabIndex="0"
    >
      <CardHeader className="space-y-4 border-b border-emerald-100 p-6">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              {currentRecipe.name}
            </CardTitle>
            {preferences && (
              <CardDescription className="mt-3 flex flex-wrap gap-2">
                {preferences.dietaryNeeds?.map(need => (
                  <Badge 
                    key={need} 
                    variant="secondary" 
                    className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                  >
                    {need}
                  </Badge>
                ))}
                {preferences.activityLevel && (
                  <Badge 
                    variant="outline" 
                    className="border-emerald-200 text-emerald-700"
                  >
                    {preferences.activityLevel}
                  </Badge>
                )}
              </CardDescription>
            )}
          </div>
          <div className="text-sm text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            Recipe {currentIndex + 1} of {recipes.length}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-8 p-6">
        {currentRecipe.nutritionalInfo && (
          <NutritionalInfo info={currentRecipe.nutritionalInfo} />
        )}

        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-emerald-800">
            <Scroll className="h-5 w-5 text-emerald-600" />
            Instructions
          </h3>
          <div className="space-y-3 text-emerald-700">
            {formatDirections(currentRecipe.directions).map((step, index) => (
              <div 
                key={index} 
                className="pl-4 leading-relaxed hover:bg-emerald-50/50 rounded-lg p-2 transition-colors"
              >
                {step}
              </div>
            ))}
          </div>
        </div>

        {currentRecipe.additionalIngredients?.length > 0 && currentRecipe.additionalIngredients.some(ingredient => ingredient) && (
          <AdditionalIngredients ingredients={currentRecipe.additionalIngredients} />
        )}

        <div className="flex justify-between items-center pt-6 border-t border-emerald-100">
          <Button
            variant="outline"
            className="flex items-center gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-200"
            onClick={handlePrevious}
            disabled={recipes.length <= 1}
            aria-label="Previous recipe"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          
          <span className="text-sm font-medium text-emerald-600" role="status">
            Recipe {currentIndex + 1} of {recipes.length}
          </span>
          
          <Button
            variant="outline"
            className="flex items-center gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-200"
            onClick={handleNext}
            disabled={recipes.length <= 1}
            aria-label="Next recipe"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecipeCard;