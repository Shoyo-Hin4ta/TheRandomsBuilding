import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

const MealDisplayCards = ({ meals = [] }) => {
  const groupedMeals = meals.reduce((acc, meal) => {
    if (!acc[meal.mealType]) {
      acc[meal.mealType] = [];
    }
    acc[meal.mealType].push(meal);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      {Object.entries(groupedMeals).map(([mealType, meals]) => (
        <div key={mealType} className="space-y-4">
          <h2 className="text-2xl font-semibold text-emerald-800 capitalize">
            {mealType}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {meals.map((meal, index) => (
              <Card 
                key={index} 
                className="overflow-hidden bg-white/80 backdrop-blur-sm border border-emerald-100 shadow-md hover:shadow-lg transition-all duration-200 hover:transform hover:scale-[1.02]"
              >
                <CardHeader className="pb-2 border-b border-emerald-50">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium text-emerald-700">
                      {meal.name}
                    </h3>
                    <span className="text-sm px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full font-medium">
                      {meal.size}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                        {meal.nutritionInfo.calories} cal
                      </span>
                      <div className="flex gap-3 text-sm text-emerald-600">
                        <span className="px-2 py-1 bg-emerald-50 rounded-full">
                          P: {meal.nutritionInfo.protein}g
                        </span>
                        <span className="px-2 py-1 bg-emerald-50 rounded-full">
                          C: {meal.nutritionInfo.carbohydrates}g
                        </span>
                        <span className="px-2 py-1 bg-emerald-50 rounded-full">
                          F: {meal.nutritionInfo.fat}g
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-emerald-600/80 bg-emerald-50/50 p-3 rounded-lg">
                      {meal.nutritionInfo.macroNutrientFacts}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MealDisplayCards;