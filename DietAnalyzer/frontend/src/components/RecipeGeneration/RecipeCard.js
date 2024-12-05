import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Scroll, Cookie, CircleDot } from "lucide-react";

const RecipeCard = ({ recipes, preferences }) => {
 const [currentIndex, setCurrentIndex] = useState(0);

 const handleNext = () => {
   setCurrentIndex((prev) => (prev + 1) % recipes.length);
 };

 const handlePrevious = () => {
   setCurrentIndex((prev) => (prev - 1 + recipes.length) % recipes.length);
 };

 if (!recipes || recipes.length === 0) {
   return (
     <Card className="mt-8 bg-white/80 backdrop-blur-sm border-emerald-100 shadow-lg">
       <CardContent className="p-8">
         <div className="text-center text-emerald-600">
           No recipes available
         </div>
       </CardContent>
     </Card>
   );
 }

 const currentRecipe = recipes[currentIndex];

 const formatDirections = (directions) => {
   if (!directions.includes('1.') && !directions.includes('Step 1')) {
     return directions.split('\n').filter(step => step.trim()).map((step, index) => 
       `${index + 1}. ${step.trim()}`
     ).join('\n\n');
   }
   return directions;
 };

 return (
   <Card className="mt-8 bg-white/80 backdrop-blur-sm border-emerald-100 shadow-lg hover:shadow-xl transition-all duration-300">
     <CardHeader className="space-y-4 border-b border-emerald-100 p-6">
       <div className="flex justify-between items-start">
         <div>
           <CardTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
             {currentRecipe.name}
           </CardTitle>
           {preferences && (
             <CardDescription className="mt-3">
               {preferences.dietaryNeeds?.map(need => (
                 <Badge 
                   key={need} 
                   variant="secondary" 
                   className="mr-2 mb-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                 >
                   {need}
                 </Badge>
               ))}
               {preferences.activityLevel && (
                 <Badge 
                   variant="outline" 
                   className="mr-2 mb-2 border-emerald-200 text-emerald-700"
                 >
                   {preferences.activityLevel}
                 </Badge>
               )}
             </CardDescription>
           )}
         </div>
         <div className="text-sm text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
           Recipe {currentIndex + 1} of {recipes.length}
         </div>
       </div>
     </CardHeader>
     
     <CardContent className="space-y-8 p-6">
       {/* Recipe Instructions */}
       <div className="space-y-4">
         <h3 className="text-lg font-semibold flex items-center gap-2 text-emerald-800">
           <Scroll className="h-5 w-5 text-emerald-600" />
           Instructions
         </h3>
         <div className="whitespace-pre-wrap text-emerald-700 space-y-4 pl-4">
           {formatDirections(currentRecipe.directions)}
         </div>
       </div>

       {/* Additional Ingredients Section */}
       {currentRecipe.additionalIngredients?.length > 0 && (
         <div className="space-y-4">
           <h3 className="text-lg font-semibold flex items-center gap-2 text-emerald-800">
             <Cookie className="h-5 w-5 text-emerald-600" />
             Additional Ingredients Needed
           </h3>
           <div className="bg-emerald-50/50 rounded-xl p-6 backdrop-blur-sm">
             <ul className="grid grid-cols-2 gap-3">
               {currentRecipe.additionalIngredients.map((ingredient, index) => (
                 <li key={index} className="flex items-center gap-2 text-emerald-700">
                   <CircleDot className="h-4 w-4 text-emerald-500" />
                   <span>{ingredient}</span>
                 </li>
               ))}
             </ul>
           </div>
         </div>
       )}

       {/* Navigation Controls */}
       <div className="flex justify-between items-center pt-6 border-t border-emerald-100">
         <Button
           variant="outline"
           className="flex items-center gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-200"
           onClick={handlePrevious}
           disabled={recipes.length <= 1}
         >
           <ChevronLeft className="h-4 w-4" />
           Previous
         </Button>
         
         <span className="text-sm font-medium text-emerald-600">
           {currentIndex + 1} / {recipes.length}
         </span>
         
         <Button
           variant="outline"
           className="flex items-center gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-200"
           onClick={handleNext}
           disabled={recipes.length <= 1}
         >
           Next
           <ChevronRight className="h-4 w-4" />
         </Button>
       </div>
     </CardContent>
   </Card>
 );
};

export default RecipeCard;