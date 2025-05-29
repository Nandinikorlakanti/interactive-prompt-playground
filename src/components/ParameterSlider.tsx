
import React, { useState } from 'react';
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
}

export const ParameterSlider: React.FC<ParameterSliderProps> = ({
  label,
  value: initialValue,
  min,
  max,
  step,
  presets,
  description,
}) => {
  const [value, setValue] = useState(initialValue);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{label}</Label>
        <span className="text-sm text-gray-600 font-mono">{value}</span>
      </div>
      
      <Slider
        value={[value]}
        onValueChange={(values) => setValue(values[0])}
        min={min}
        max={max}
        step={step}
        className="w-full"
      />
      
      <div className="flex space-x-2">
        {presets.map((preset) => (
          <Button
            key={preset}
            variant={value === preset ? "default" : "outline"}
            size="sm"
            onClick={() => setValue(preset)}
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
