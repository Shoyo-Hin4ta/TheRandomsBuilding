import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const IngredientList = ({ ingredients, onEdit, onRemove }) => {
  if (ingredients.length === 0) {
    return (
      <Card className="bg-muted">
        <CardContent className="p-4">
          <p className="text-muted-foreground text-center">
            No ingredients added yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {ingredients.map((ingredient, index) => (
        <Card key={index} className="bg-muted">
          <CardContent className="p-4 flex items-center justify-between">
            <span>{ingredient}</span>
            <div className="space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onEdit(index)}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onRemove(index)}
              >
                Remove
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default IngredientList;