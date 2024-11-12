import React, { useState } from 'react';
import { ArrowLeft, Camera, PenLine } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ImageCapture from './ImageCapture';
import DateSelector from './DateSelector';
import MealTypeSelector from './MealComponents/MealTypeSelector';
import MealEntryForm from './MealComponents/MealEntryForm';
import IngredientEntrySystem from './IngredientComponents/IngredientEntrySystem';

const MealLogging = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [mealType, setMealType] = useState('');
  const [entryMethod, setEntryMethod] = useState(null);
  const [manualEntryType, setManualEntryType] = useState(null);
  
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
            >
              <Camera className="w-5 h-5" />
              Take Picture
            </Button>
            <Button 
              variant="outline"
              onClick={() => setEntryMethod('manual')}
              className="flex items-center justify-center gap-2"
            >
              <PenLine className="w-5 h-5" />
              Enter Manually
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );


  const renderManualEntryOptions = () => (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setEntryMethod(null)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <CardTitle>Add Manual Entry Meal / Ingredients</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-4">
        <Button 
          className="w-full mb-3"
          onClick={() => setManualEntryType('wholeMeal')}
        >
          Enter Whole Meal
        </Button>
        <Button 
          variant="outline"
          className="w-full"
          onClick={() => setManualEntryType('ingredients')}
        >
          Enter Ingredients
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="w-full max-w-md mx-auto p-4 pb-24">
      {!entryMethod && renderInitialOptions()}
      
      {entryMethod === 'camera' && (
        <ImageCapture 
          mealType={mealType}
          selectedDate={selectedDate}
          onBack={() => setEntryMethod(null)}
          onComplete={(data) => {
            console.log({ ...data, date: selectedDate });
          }}
        />
      )}
      
      {entryMethod === 'manual' && !manualEntryType && renderManualEntryOptions()}
      
      {manualEntryType === 'wholeMeal' && (
        <MealEntryForm 
          mealType={mealType}
          selectedDate={selectedDate}
          onBack={() => setManualEntryType(null)}
          onComplete={(data) => {
            console.log({ ...data, date: selectedDate });
          }}
        />
      )}
      
      {manualEntryType === 'ingredients' && (
        <IngredientEntrySystem 
          mealType={mealType}
          selectedDate={selectedDate}
          onBack={() => setManualEntryType(null)}
          onComplete={(data) => {
            console.log({ ...data, date: selectedDate });
          }}
        />
      )}

      <DateSelector 
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />
    </div>
  );
};

export default MealLogging;