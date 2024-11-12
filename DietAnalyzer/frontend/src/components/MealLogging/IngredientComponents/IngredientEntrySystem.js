import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import IngredientEntry from './IngredientEntry';
import SavedIngredientsList from './SavedIngredientsList';

const IngredientEntrySystem = ({ mealType, onBack, onComplete }) => {
  const [ingredients, setIngredients] = useState([]);
  const [showEntryForm, setShowEntryForm] = useState(true);

  const handleSaveIngredient = (ingredient) => {
    setIngredients([...ingredients, { ...ingredient, id: Date.now() }]);
    setShowEntryForm(false);
  };

  const handleUpdateIngredient = (id, updatedIngredient) => {
    setIngredients(ingredients.map(ing => 
      ing.id === id ? { ...updatedIngredient, id } : ing
    ));
  };

  const handleRemoveIngredient = (id) => {
    setIngredients(ingredients.filter(ing => ing.id !== id));
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
          <CardTitle>Enter Ingredients</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <SavedIngredientsList 
          ingredients={ingredients}
          onUpdate={handleUpdateIngredient}
          onRemove={handleRemoveIngredient}
        />
        
        {showEntryForm ? (
          <IngredientEntry 
            onSave={handleSaveIngredient}
            onCancel={() => setShowEntryForm(false)}
          />
        ) : (
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => setShowEntryForm(true)}
          >
            Add Ingredient
          </Button>
        )}
        
        {ingredients.length > 0 && (
          <Button 
            className="w-full"
            onClick={() => onComplete(ingredients)}
          >
            Complete
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default IngredientEntrySystem;