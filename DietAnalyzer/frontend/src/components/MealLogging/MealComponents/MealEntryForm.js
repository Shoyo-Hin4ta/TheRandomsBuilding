import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import MealSizeSelector from './MealSizeSelector';

const MealEntryForm = ({ mealType, onBack, onComplete }) => {
  const [size, setSize] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
 
  const handleSubmit = (e) => {
    e.preventDefault();
    onComplete({
      mealType,
      size,
      name: name.trim() || `Meal ${Date.now()}`,
      description
    });
  };
 
  return (
    <Card className="bg-white/90 backdrop-blur-sm border-emerald-100 shadow-lg">
      <CardHeader className="pb-3 border-b border-emerald-100">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <CardTitle className="text-emerald-800">Enter Whole Meal</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <MealSizeSelector 
            value={size}
            onChange={setSize}
          />
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-emerald-800">
              Meal Name (optional)
            </label>
            <Input
              placeholder="Enter meal name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-emerald-200 focus:ring-emerald-500 focus:border-emerald-500 rounded-lg"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-emerald-800">
              Meal Description
            </label>
            <Textarea
              placeholder="Describe what you're eating..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="border-emerald-200 focus:ring-emerald-500 focus:border-emerald-500 rounded-lg min-h-[120px] resize-none"
            />
          </div>
          
          <Button 
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl py-6 shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
            disabled={!size || !description}
          >
            Save Meal
          </Button>
        </form>
      </CardContent>
    </Card>
  );
 };
 
export default MealEntryForm;

