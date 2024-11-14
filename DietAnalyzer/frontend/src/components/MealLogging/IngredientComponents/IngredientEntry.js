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
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <Input
        placeholder="Ingredient Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Measurement:</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsCustomMeasurement(!isCustomMeasurement)}
          >
            {isCustomMeasurement ? 'Use Standard Units' : 'Enter Custom'}
          </Button>
        </div>

        {isCustomMeasurement ? (
          <Input
            placeholder="Enter custom measurement (e.g., '2 handfuls')"
            value={customMeasurement}
            onChange={(e) => setCustomMeasurement(e.target.value)}
          />
        ) : (
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Amount"
              className="w-24"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <Select value={unit} onValueChange={setUnit}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent>
                {MEASUREMENT_UNITS.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={handleSave}
          disabled={!name || (!customMeasurement && !amount)}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default IngredientEntry;