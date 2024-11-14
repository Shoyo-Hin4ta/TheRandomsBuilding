import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MEAL_TYPES } from '../../../utils/constants';

const MealTypeSelector = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        Select Meal Type
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Choose meal type" />
        </SelectTrigger>
        <SelectContent>
          {MEAL_TYPES.map(({ value, label }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default MealTypeSelector;