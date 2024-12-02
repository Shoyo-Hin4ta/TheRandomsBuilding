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
      await mealService.addMeal({
        ...data,
        date: selectedDate
      });
      
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
    <Card className="mb-4">
      <CardContent className="pt-6 space-y-4">
        <MealTypeSelector 
          value={mealType} 
          onChange={setMealType}
        />
        
        {mealType && (
          <div className="grid grid-cols-1 gap-3">
            <Button 
              className="flex items-center justify-center gap-2"
              onClick={() => setEntryMethod('camera')}
              disabled={isLoading}
            >
              <Camera className="w-5 h-5" />
              Take Picture
            </Button>
            <Button 
              variant="outline"
              onClick={() => setEntryMethod('manual')}
              className="flex items-center justify-center gap-2"
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
      <h1 className="text-2xl font-bold mb-6 text-center">Track Your Meal</h1>
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
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setEntryMethod(null)}
                disabled={isLoading}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <CardTitle>Add Manual Entry</CardTitle>
            </div>
          </CardHeader>

          <CardContent className="pt-6 space-y-4">
            <Button 
              className="w-full mb-3"
              onClick={() => setManualEntryType('wholeMeal')}
              disabled={isLoading}
            >
              Enter Whole Meal
            </Button>
            <Button 
              variant="outline"
              className="w-full"
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

      <MealDisplayCards meals={meals} />

      <DateSelector 
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        disabled={isLoading}
      />
    </div>
  );
};

export default MealLogging;