import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MEAL_TYPES } from '../../../utils/constants';

const MealTypeSelector = ({ value, onChange }) => {
 return (
   <div className="space-y-2">
     <label className="text-sm font-medium text-emerald-800">
       Select Meal Type
     </label>
     <Select value={value} onValueChange={onChange}>
       <SelectTrigger className="border-emerald-200 hover:border-emerald-300 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 rounded-xl bg-white/80 backdrop-blur-sm">
         <SelectValue placeholder="Choose meal type" className="text-emerald-600 placeholder:text-emerald-400" />
       </SelectTrigger>
       <SelectContent className="bg-white/95 backdrop-blur-sm border-emerald-100 rounded-lg shadow-lg">
         {MEAL_TYPES.map(({ value, label }) => (
           <SelectItem 
             key={value} 
             value={value}
             className="hover:bg-emerald-50 focus:bg-emerald-50 text-emerald-700 focus:text-emerald-800 cursor-pointer"
           >
             {label}
           </SelectItem>
         ))}
       </SelectContent>
     </Select>
   </div>
 );
};

export default MealTypeSelector;