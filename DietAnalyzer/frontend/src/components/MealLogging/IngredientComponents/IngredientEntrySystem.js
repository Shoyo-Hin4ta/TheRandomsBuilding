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

  const handleComplete = () => {
    // Transform ingredients to match backend schema
    const formattedIngredients = ingredients.map((ing, index) => {
      if (ing.customMeasurement) {
        return {
          name: ing.name,
          measurement: {
            isCustom: true,
            value: ing.customMeasurement,
            unit: 'custom'
          }
        };
      }
      return {
        name: ing.name,
        measurement: {
          isCustom: false,
          value: ing.amount,
          unit: ing.unit
        }
      };
    });

    onComplete({
      ingredients: formattedIngredients,
      mealType
    });
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-emerald-100 shadow-lg">
      <CardHeader className="pb-3 border-b border-emerald-100">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <CardTitle className="text-emerald-800 text-xl">Enter Ingredients</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6 pt-6">
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
            className="w-full border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 rounded-xl py-6 transition-all duration-200"
            onClick={() => setShowEntryForm(true)}
          >
            Add Ingredient
          </Button>
        )}
        
        {ingredients.length > 0 && (
          <Button 
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl py-6 shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
            onClick={handleComplete}
          >
            Complete
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default IngredientEntrySystem;