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
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <CardTitle>Enter Whole Meal</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <MealSizeSelector 
            value={size}
            onChange={setSize}
          />
          
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Meal Name (optional)
            </label>
            <Input
              placeholder="Enter meal name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Meal Description
            </label>
            <Textarea
              placeholder="Describe what you're eating..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>
          
          <Button 
            type="submit"
            className="w-full"
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
