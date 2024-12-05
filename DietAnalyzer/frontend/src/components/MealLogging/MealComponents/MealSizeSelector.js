import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MEAL_SIZES } from '../../../utils/constants';

const MealSizeSelector = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-emerald-800">
        Select Meal Size
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="border-emerald-200 hover:border-emerald-300 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 rounded-xl py-6">
          <SelectValue placeholder="Choose meal size" className="text-emerald-600" />
        </SelectTrigger>
        <SelectContent className="bg-white/95 backdrop-blur-sm border-emerald-100 rounded-xl shadow-lg">
          {MEAL_SIZES.map(({ value, label }) => (
            <SelectItem 
              key={value} 
              value={value}
              className="hover:bg-emerald-50 focus:bg-emerald-50 cursor-pointer py-3"
            >
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default MealSizeSelector;