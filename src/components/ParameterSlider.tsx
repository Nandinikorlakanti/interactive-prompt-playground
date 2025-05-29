import React, { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface ParameterSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  presets: number[];
  description?: string;
  onChange?: (value: number) => void;
}

export const ParameterSlider: React.FC<ParameterSliderProps> = ({
  label,
  value: initialValue,
  min,
  max,
  step,
  presets,
  description,
  onChange,
}) => {
  const [value, setValue] = useState(initialValue);

  // Validate and update value when initialValue changes
  useEffect(() => {
    const validatedValue = Math.max(min, Math.min(max, initialValue));
    setValue(validatedValue);
  }, [initialValue, min, max]);

  const handleValueChange = (newValue: number[]) => {
    const validatedValue = Math.max(min, Math.min(max, newValue[0]));
    setValue(validatedValue);
    onChange?.(validatedValue);
  };

  // Calculate the percentage for the gradient background
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{label}</Label>
        <span className="text-sm text-gray-600 font-mono">{value.toFixed(1)}</span>
      </div>
      
      <div className="relative">
        <Slider
          value={[value]}
          onValueChange={handleValueChange}
          min={min}
          max={max}
          step={step}
          className="w-full"
          style={{
            background: `linear-gradient(to right, #e5e7eb ${percentage}%, #f3f4f6 ${percentage}%)`
          }}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      </div>
      
      <div className="flex space-x-2">
        {presets.map((preset) => (
          <Button
            key={preset}
            variant={value === preset ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setValue(preset);
              onChange?.(preset);
            }}
            className="text-xs px-2 py-1"
          >
            {preset}
          </Button>
        ))}
      </div>
      
      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}
    </div>
  );
};
