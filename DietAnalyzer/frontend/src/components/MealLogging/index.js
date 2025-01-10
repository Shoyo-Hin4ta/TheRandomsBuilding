import React, { useEffect, useState } from 'react';
import { ArrowLeft, Camera, PenLine } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ImageCapture from './ImageCapture';
import DateSelector from './DateSelector';
import MealTypeSelector from './MealComponents/MealTypeSelector';
import MealEntryForm from './MealComponents/MealEntryForm';
import IngredientEntrySystem from './IngredientComponents/IngredientEntrySystem';
import { mealService } from '@/services/mealService';
import MealDisplayCards from './MealComponents/MealDisplayCards';


const MealLogging = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [mealType, setMealType] = useState('');
  const [entryMethod, setEntryMethod] = useState(null);
  const [manualEntryType, setManualEntryType] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [meals, setMeals] = useState([]);

  const handleMealSubmit = async (data) => {
    setIsLoading(true);
    try {
      
      const mealData = {
        ...data,
        mealType: mealType, // Explicitly set mealType from component state
        date: selectedDate
      };
      // console.log('Submitting meal data:', mealData); // Debug log
      await mealService.addMeal(mealData);

      // Reset form state
      setMealType('');
      setEntryMethod(null);
      setManualEntryType(null);
      alert('Meal logged successfully!');
    } catch (err) {
      console.error('Error logging meal:', err);
      alert('Failed to log meal. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect(() => {
  //   const fetchMeals = async () => {
  //     try {
  //       const response = await mealService.getMealsByDate(selectedDate);
  //       setMeals(response.data.data);
  //     } catch (err) {
  //       console.error('Error fetching meals:', err);
  //     }
  //   };
    
  //   fetchMeals();
  // }, [selectedDate]);


  

  const renderInitialOptions = () => (
    <Card className="mb-6 bg-white/90 backdrop-blur-sm border-emerald-100 shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardContent className="pt-8 space-y-6">
        <MealTypeSelector 
          value={mealType} 
          onChange={setMealType}
        />
        
        {mealType && (
          <div className="grid grid-cols-1 gap-4">
            <Button 
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white flex items-center justify-center gap-3 py-6 rounded-xl shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
              onClick={() => setEntryMethod('camera')}
              disabled={isLoading}
            >
              <Camera className="w-5 h-5" />
              Take Picture
            </Button>
            <Button 
              variant="outline"
              onClick={() => setEntryMethod('manual')}
              className="border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 flex items-center justify-center gap-3 py-6 rounded-xl transition-colors duration-200"
              disabled={isLoading}
            >
              <PenLine className="w-5 h-5" />
              Enter Manually
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="w-full max-w-md mx-auto p-4 pb-24">
      <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
        Track Your Meal
      </h1>
      
      {!entryMethod && renderInitialOptions()}
      
      {entryMethod === 'camera' && (
        <ImageCapture 
          mealType={mealType}
          onBack={() => setEntryMethod(null)}
          onComplete={handleMealSubmit}
          isLoading={isLoading}
        />
      )}
      
      {entryMethod === 'manual' && !manualEntryType && (
        <Card className="mb-6 bg-white/90 backdrop-blur-sm border-emerald-100 shadow-md">
          <CardHeader className="pb-3 border-b border-emerald-100">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setEntryMethod(null)}
                disabled={isLoading}
                className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <CardTitle className="text-emerald-800">Add Manual Entry</CardTitle>
            </div>
          </CardHeader>

          <CardContent className="pt-6 space-y-4">
            <Button 
              className="w-full py-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
              onClick={() => setManualEntryType('wholeMeal')}
              disabled={isLoading}
            >
              Enter Whole Meal
            </Button>
            <Button 
              variant="outline"
              className="w-full py-6 border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors duration-200"
              onClick={() => setManualEntryType('ingredients')}
              disabled={isLoading}
            >
              Enter Ingredients
            </Button>
          </CardContent>
        </Card>
      )}
      
      {manualEntryType === 'wholeMeal' && (
        <MealEntryForm 
          mealType={mealType}
          onBack={() => setManualEntryType(null)}
          onComplete={handleMealSubmit}
          isLoading={isLoading}
        />
      )}
      
      {manualEntryType === 'ingredients' && (
        <IngredientEntrySystem 
          mealType={mealType}
          onBack={() => setManualEntryType(null)}
          onComplete={handleMealSubmit}
          isLoading={isLoading}
        />
      )}

      <div className="mb-24">
        <MealDisplayCards meals={meals} />
      </div>

      <DateSelector 
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        disabled={isLoading}
      />
    </div>
  );
};

export default MealLogging;