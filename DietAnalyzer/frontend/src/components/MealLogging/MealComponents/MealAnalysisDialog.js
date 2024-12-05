import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export const MealAnalysisDialog = ({ meal, isOpen, onClose }) => {
  if (!meal) return null;

  const { nutritionInfo } = meal;
  const analysis = nutritionInfo.ingredientAnalysis;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white/95 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-emerald-800">
            Ingredient Analysis: {meal.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          {analysis?.mainIngredients?.length > 0 && (
            <div>
              <h3 className="font-medium text-emerald-700 mb-2">Main Ingredients</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.mainIngredients.map((ingredient, idx) => (
                  <Badge 
                    key={idx}
                    variant="secondary" 
                    className="bg-emerald-50 text-emerald-700 border border-emerald-200"
                  >
                    {ingredient}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {analysis?.nutritionalHighlights && (
            <div>
              <h3 className="font-medium text-emerald-700 mb-2">Nutritional Highlights</h3>
              <p className="text-emerald-600">{analysis.nutritionalHighlights}</p>
            </div>
          )}

          {analysis?.dietaryConsiderations && (
            <div>
              <h3 className="font-medium text-emerald-700 mb-2">Dietary Considerations</h3>
              <p className="text-emerald-600">{analysis.dietaryConsiderations}</p>
            </div>
          )}

          {analysis?.healthBenefits && (
            <div>
              <h3 className="font-medium text-emerald-700 mb-2">Health Benefits</h3>
              <p className="text-emerald-600">{analysis.healthBenefits}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MealAnalysisDialog;