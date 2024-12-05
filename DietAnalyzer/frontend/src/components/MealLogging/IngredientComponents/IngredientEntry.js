import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const MEASUREMENT_UNITS = [
 { value: 'g', label: 'grams (g)' },
 { value: 'ml', label: 'milliliters (ml)' },
 { value: 'cups', label: 'cups' },
 { value: 'tbsp', label: 'tablespoons' },
 { value: 'tsp', label: 'teaspoons' },
 { value: 'oz', label: 'ounces' },
 { value: 'pieces', label: 'pieces/count' }
];

const IngredientEntry = ({ onSave, onCancel, initialValue = null }) => {
 const [name, setName] = useState(initialValue?.name || '');
 const [isCustomMeasurement, setIsCustomMeasurement] = useState(false);
 const [amount, setAmount] = useState(initialValue?.amount || '');
 const [unit, setUnit] = useState(initialValue?.unit || 'g');
 const [customMeasurement, setCustomMeasurement] = useState(initialValue?.customMeasurement || '');

 const handleSave = () => {
   if (!name) return;
   
   onSave({
     name,
     ...(isCustomMeasurement 
       ? { customMeasurement } 
       : { amount, unit })
   });

   // Reset form
   setName('');
   setAmount('');
   setUnit('g');
   setCustomMeasurement('');
   setIsCustomMeasurement(false);
 };

 return (
   <div className="space-y-4 p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-emerald-100 shadow-md">
     <Input
       placeholder="Ingredient Name"
       value={name}
       onChange={(e) => setName(e.target.value)}
       className="border-emerald-200 focus:ring-emerald-500 focus:border-emerald-500 rounded-lg"
     />
     
     <div className="space-y-3">
       <div className="flex items-center justify-between">
         <span className="text-sm font-medium text-emerald-800">Measurement:</span>
         <Button
           type="button"
           variant="ghost"
           size="sm"
           onClick={() => setIsCustomMeasurement(!isCustomMeasurement)}
           className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
         >
           {isCustomMeasurement ? 'Use Standard Units' : 'Enter Custom'}
         </Button>
       </div>

       {isCustomMeasurement ? (
         <Input
           placeholder="Enter custom measurement (e.g., '2 handfuls')"
           value={customMeasurement}
           onChange={(e) => setCustomMeasurement(e.target.value)}
           className="border-emerald-200 focus:ring-emerald-500 focus:border-emerald-500 rounded-lg"
         />
       ) : (
         <div className="flex gap-3">
           <Input
             type="number"
             placeholder="Amount"
             className="w-24 border-emerald-200 focus:ring-emerald-500 focus:border-emerald-500 rounded-lg"
             value={amount}
             onChange={(e) => setAmount(e.target.value)}
           />
           <Select value={unit} onValueChange={setUnit}>
             <SelectTrigger className="w-[180px] border-emerald-200 focus:ring-emerald-500 focus:border-emerald-500 rounded-lg">
               <SelectValue placeholder="Unit" />
             </SelectTrigger>
             <SelectContent className="rounded-lg border-emerald-100">
               {MEASUREMENT_UNITS.map(({ value, label }) => (
                 <SelectItem 
                   key={value} 
                   value={value}
                   className="focus:bg-emerald-50 focus:text-emerald-900"
                 >
                   {label}
                 </SelectItem>
               ))}
             </SelectContent>
           </Select>
         </div>
       )}
     </div>

     <div className="flex justify-end gap-3 pt-2">
       <Button
         type="button"
         variant="ghost"
         onClick={onCancel}
         className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
       >
         Cancel
       </Button>
       <Button
         type="button"
         onClick={handleSave}
         disabled={!name || (!customMeasurement && !amount)}
         className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-sm hover:shadow-md transition-all duration-200"
       >
         Save
       </Button>
     </div>
   </div>
 );
};

export default IngredientEntry;