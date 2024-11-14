import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MEAL_SIZES } from '../../../utils/constants';

const MealSizeSelector = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        Select Meal Size
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Choose meal size" />
        </SelectTrigger>
        <SelectContent>
          {MEAL_SIZES.map(({ value, label }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default MealSizeSelector;