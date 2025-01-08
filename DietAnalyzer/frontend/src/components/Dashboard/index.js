import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import DateSelector from '../MealLogging/DateSelector';
import { selectCurrentUser } from '@/store/slice/userSlice';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import MealAnalysisDialog from '../MealLogging/MealComponents/MealAnalysisDialog';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Activity, Utensils } from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function Dashboard() {
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [mealsByType, setMealsByType] = useState({
    breakfast: [],
    lunch: [],
    dinner: [],
    snack: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const currentUser = useSelector(selectCurrentUser);
  const { toast } = useToast();
  const accessToken = useSelector(state => state.user.accessToken);

  const fetchMeals = async () => {
    if (!currentUser) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/meals/date/${selectedDate.toISOString().split('T')[0]}`,
        {  
          headers: {
              Authorization: `Bearer ${accessToken}`
          }
        }
      );

      const grouped = response.data.data.reduce((acc, meal) => {
        if (!acc[meal.mealType]) {
          acc[meal.mealType] = [];
        }
        acc[meal.mealType].push(meal);
        return acc;
      }, {
        breakfast: [],
        lunch: [],
        dinner: [],
        snack: []
      });
      
      setMealsByType(grouped);
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, [selectedDate, currentUser]);

  const handleDeleteMeal = async (mealId) => {
    try {
      await axios.delete(`${API_BASE_URL}/meals/${mealId}`, {
        withCredentials: true
      });
      
      toast({
        title: "Success",
        description: "Meal deleted successfully",
      });
      
      fetchMeals();
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete meal",
        variant: "destructive",
      });
    }
  };

  const getTotalNutrients = (meals) => ({
    calories: meals.reduce((sum, meal) => sum + (meal.nutritionInfo?.calories || 0), 0),
    protein: meals.reduce((sum, meal) => sum + (meal.nutritionInfo?.protein || 0), 0),
    carbohydrates: meals.reduce((sum, meal) => sum + (meal.nutritionInfo?.carbohydrates || 0), 0),
    fat: meals.reduce((sum, meal) => sum + (meal.nutritionInfo?.fat || 0), 0)
  });

  const getDailyTotals = () => {
    const allMeals = Object.values(mealsByType).flat();
    return getTotalNutrients(allMeals);
  };

  const renderDailySummary = () => {
    const totals = getDailyTotals();
    const macroData = [
      { name: 'Protein', value: totals.protein, color: '#059669' },
      { name: 'Carbs', value: totals.carbohydrates, color: '#10b981' },
      { name: 'Fat', value: totals.fat, color: '#34d399' }
    ];

    return (
      <Card className="mb-6 bg-white/80 backdrop-blur-sm border-emerald-100 shadow-md">
        <CardHeader className="pb-2 border-b border-emerald-100">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold text-emerald-800">
              Daily Summary
            </CardTitle>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-600" />
              <span className="font-medium text-emerald-700">{totals.calories} cal</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={macroData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                  >
                    {macroData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white/95 border border-emerald-200 rounded-lg p-2 shadow-lg">
                            <p className="text-sm text-emerald-800">
                              {payload[0].name}: {payload[0].value.toFixed(1)}g
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend
                    verticalAlign="middle"
                    align="right"
                    layout="vertical"
                    formatter={(value, entry) => (
                      <span className="text-sm text-emerald-700">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col justify-center space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(mealsByType).map(([type, meals]) => {
                  const mealTotal = getTotalNutrients(meals);
                  return (
                    <div 
                      key={type}
                      className="bg-emerald-50/50 rounded-lg p-3 border border-emerald-100"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Utensils className="h-4 w-4 text-emerald-600" />
                        <span className="text-sm font-medium text-emerald-800 capitalize">
                          {type}
                        </span>
                      </div>
                      <p className="text-sm text-emerald-600">
                        {mealTotal.calories} cal
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderMealTypeCard = (type, meals) => {
    const totals = getTotalNutrients(meals);
    const formattedType = type.charAt(0).toUpperCase() + type.slice(1);
  
    if (isLoading) {
      return (
        <Card className="mb-4 bg-white/80 backdrop-blur-sm border-emerald-100 shadow-md" key={type}>
          <CardHeader className="pb-2">
            <Skeleton className="h-6 w-32 bg-emerald-100" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-20 w-full bg-emerald-50" />
          </CardContent>
        </Card>
      );
    }
  
    return (
      <Card className="mb-4 bg-white/80 backdrop-blur-sm border-emerald-100 shadow-md hover:shadow-lg transition-shadow duration-200" key={type}>
        <CardHeader className="pb-2 border-b border-emerald-100">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold text-emerald-800">
              {formattedType}
            </CardTitle>
            <Badge 
              variant="secondary" 
              className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors"
            >
              {totals.calories} cal
            </Badge>
          </div>
          <div className="text-xs text-emerald-600 mt-1 font-medium">
            P: {totals.protein}g • C: {totals.carbohydrates}g • F: {totals.fat}g
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          {meals.length === 0 ? (
            <p className="text-sm text-emerald-600/60 text-center py-4">No meals logged</p>
          ) : (
            <div className="space-y-4">
              {meals.map((meal) => (
                <div 
                  key={meal._id} 
                  className="group relative flex flex-col border-b border-emerald-100 pb-3 hover:bg-emerald-50/50 rounded-lg transition-colors duration-200 p-2 cursor-pointer"
                  onClick={() => setSelectedMeal(meal)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 pr-6">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-emerald-900">{meal.name}</p>
                        {meal.size !== 'M' && (
                          <Badge 
                            variant="outline" 
                            className="text-xs border-emerald-200 text-emerald-700"
                          >
                            {meal.size}
                          </Badge>
                        )}
                      </div>
                      {meal.ingredients?.length > 0 && (
                        <p className="text-xs text-emerald-600/80 mt-1">
                          {meal.ingredients.map(i => i.name).join(', ')}
                        </p>
                      )}
                      <p className="text-sm text-emerald-600/70 mt-1 hover:break-normal break-all">
                        {meal.nutritionInfo?.macroNutrientFacts}
                      </p>
                    </div>
                    <div className="text-sm text-right">
                      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors">
                        {meal.nutritionInfo?.calories} cal
                      </Badge>
                      <p className="text-xs text-emerald-600 mt-1">
                        P: {meal.nutritionInfo?.protein}g • 
                        C: {meal.nutritionInfo?.carbohydrates}g • 
                        F: {meal.nutritionInfo?.fat}g
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-2 flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-red-600 hover:text-red-700 hover:bg-red-100/50"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteMeal(meal._id);
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (error) {
    return (
      <Alert variant="destructive" className="m-4 bg-red-50 border-red-200 text-red-700">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      <div className="w-full max-w-md mx-auto p-4 pb-24">
        <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          {currentUser?.firstName}'s Dashboard
        </h1>

        {renderDailySummary()}
        
        {Object.entries(mealsByType).map(([type, meals]) => 
          renderMealTypeCard(type, meals)
        )}

        <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-emerald-100">
          <div className="max-w-md mx-auto">
            <DateSelector
              selectedDate={selectedDate}
              onDateChange={(date) => {
                const localDate = new Date(date.setHours(0, 0, 0, 0));
                setSelectedDate(localDate);
              }}
              disabled={isLoading}
            />
          </div>
        </div>
      </div>
      <MealAnalysisDialog
        meal={selectedMeal}
        isOpen={!!selectedMeal}
        onClose={() => setSelectedMeal(null)}
      />
    </div>
  );
}