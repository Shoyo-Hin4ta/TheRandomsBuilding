import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

const RecipeCard = ({ recipes }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % recipes.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + recipes.length) % recipes.length);
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>{recipes[currentIndex].name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="min-h-[200px] mb-4 whitespace-pre-wrap">
          {recipes[currentIndex].directions}
        </div>
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevious}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            {`${currentIndex + 1} / ${recipes.length}`}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecipeCard;