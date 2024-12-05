import React, { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import IngredientEntry from './IngredientEntry';

const SavedIngredientsList = ({ ingredients, onUpdate, onRemove }) => {
  const [editingId, setEditingId] = useState(null);

  const formatMeasurement = (ingredient) => {
    if (ingredient.customMeasurement) {
      return ingredient.customMeasurement;
    }
    return `${ingredient.amount} ${ingredient.unit}`;
  };

  // Helper function to convert ingredient data for editing
  const prepareIngredientForEditing = (ingredient) => {
    if (ingredient.customMeasurement) {
      return {
        name: ingredient.name,
        customMeasurement: ingredient.customMeasurement,
      };
    }
    return {
      name: ingredient.name,
      amount: ingredient.amount,
      unit: ingredient.unit
    };
  };

  return (
    <div className="space-y-3">
      {ingredients.map((ingredient) => (
        <div key={ingredient.id}>
          {editingId === ingredient.id ? (
            <IngredientEntry
              initialValue={prepareIngredientForEditing(ingredient)}
              onSave={(updated) => {
                onUpdate(ingredient.id, updated);
                setEditingId(null);
              }}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <div className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border border-emerald-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
              <div>
                <span className="font-medium text-emerald-800">{ingredient.name}</span>
                <span className="text-emerald-600 ml-2 bg-emerald-50 px-2 py-1 rounded-full text-sm">
                  {formatMeasurement(ingredient)}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditingId(ingredient.id)}
                  className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  onClick={() => onRemove(ingredient.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      ))}
      {ingredients.length === 0 && (
        <div className="text-center text-emerald-600/70 py-8 bg-emerald-50/50 rounded-xl border border-emerald-100 backdrop-blur-sm">
          <span className="font-medium">No ingredients added yet</span>
        </div>
      )}
    </div>
  );
};

export default SavedIngredientsList;