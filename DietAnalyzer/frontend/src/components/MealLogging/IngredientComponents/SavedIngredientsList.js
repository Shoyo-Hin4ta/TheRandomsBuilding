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

  return (
    <div className="space-y-2">
      {ingredients.map((ingredient) => (
        <div key={ingredient.id}>
          {editingId === ingredient.id ? (
            <IngredientEntry
              initialValue={ingredient}
              onSave={(updated) => {
                onUpdate(ingredient.id, updated);
                setEditingId(null);
              }}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <div className="flex items-center justify-between p-3 bg-white border rounded-lg">
              <div>
                <span className="font-medium">{ingredient.name}</span>
                <span className="text-gray-500 ml-2">
                  {formatMeasurement(ingredient)}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditingId(ingredient.id)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-600"
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
        <div className="text-center text-gray-500 py-4">
          No ingredients added yet
        </div>
      )}
    </div>
  );
};

export default SavedIngredientsList;