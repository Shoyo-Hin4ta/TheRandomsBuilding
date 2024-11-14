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
    <div className="space-y-6">
      {Object.entries(groupedMeals).map(([mealType, meals]) => (
        <div key={mealType} className="space-y-4">
          <h2 className="text-2xl font-semibold capitalize">{mealType}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {meals.map((meal, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium">{meal.name}</h3>
                    <span className="text-sm text-muted-foreground">
                      {meal.size}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">
                        {meal.nutritionInfo.calories} cal
                      </span>
                      <div className="text-sm text-muted-foreground">
                        P: {meal.nutritionInfo.protein}g | 
                        C: {meal.nutritionInfo.carbohydrates}g | 
                        F: {meal.nutritionInfo.fat}g
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
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