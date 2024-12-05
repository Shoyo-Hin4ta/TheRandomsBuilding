import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, X } from 'lucide-react';

const IngredientList = ({ ingredients, onEdit, onRemove }) => {
 const handleRemove = (e, index) => {
   e.preventDefault();
   e.stopPropagation();
   onRemove(index);
 };

 const handleEdit = (e, index) => {
   e.preventDefault();
   e.stopPropagation();
   onEdit(index);
 };

 if (ingredients.length === 0) {
   return (
     <Card className="bg-emerald-50/50 backdrop-blur-sm border border-emerald-100">
       <CardContent className="p-6">
         <p className="text-emerald-600 text-center font-medium">
           No ingredients added yet.
         </p>
       </CardContent>
     </Card>
   );
 }

 return (
   <div className="space-y-3">
     {ingredients.map((ingredient, index) => (
       <Card 
         key={index} 
         className="bg-white/80 backdrop-blur-sm border border-emerald-100 hover:shadow-md transition-shadow duration-200"
       >
         <CardContent className="p-4 flex items-center justify-between">
           <span className="text-emerald-800 font-medium">{ingredient}</span>
           <div className="flex gap-2">
             <Button
               type="button"
               variant="ghost"
               size="sm"
               onClick={(e) => handleEdit(e, index)}
               className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
             >
               <Pencil className="h-4 w-4 mr-1" />
               Edit
             </Button>
             <Button
               type="button"
               variant="ghost"
               size="sm"
               onClick={(e) => handleRemove(e, index)}
               className="text-red-500 hover:text-red-600 hover:bg-red-50"
             >
               <X className="h-4 w-4 mr-1" />
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