
"use client";

import { useState, type ChangeEvent, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Thermometer } from 'lucide-react';

type TemperatureUnit = 'Celsius' | 'Fahrenheit' | 'Kelvin';

export function TemperatureConverterTool() {
  const [inputValue, setInputValue] = useState<string>('0');
  const [celsius, setCelsius] = useState<string>('0');
  const [fahrenheit, setFahrenheit] = useState<string>('32');
  const [kelvin, setKelvin] = useState<string>('273.15');
  const [inputUnit, setInputUnit] = useState<TemperatureUnit>('Celsius');


  const handleInputChange = (value: string, unit: TemperatureUnit) => {
    setInputValue(value); // Store the raw input
    setInputUnit(unit);  // Store which unit field was edited

    const numValue = parseFloat(value);
    if (isNaN(numValue) && value !== '' && value !== '-') { // Allow empty or just minus for typing
      // Reset if invalid, or keep current values
      // For simplicity, let's not auto-clear other fields on invalid intermediate input
      return;
    }
    
    if (value === '' || value === '-') { // If input is cleared or just a minus sign
        setCelsius(unit === 'Celsius' ? value : '');
        setFahrenheit(unit === 'Fahrenheit' ? value : '');
        setKelvin(unit === 'Kelvin' ? value : '');
        return;
    }

    let c = NaN, f = NaN, k = NaN;

    if (unit === 'Celsius') {
      c = numValue;
      f = (c * 9/5) + 32;
      k = c + 273.15;
    } else if (unit === 'Fahrenheit') {
      f = numValue;
      c = (f - 32) * 5/9;
      k = c + 273.15;
    } else if (unit === 'Kelvin') {
      k = numValue;
      c = k - 273.15;
      f = (c * 9/5) + 32;
    }

    setCelsius(formatTemp(c));
    setFahrenheit(formatTemp(f));
    setKelvin(formatTemp(k));
  };
  
  const formatTemp = (temp: number | null | undefined): string => {
    if (temp === null || temp === undefined || isNaN(temp)) return '';
    // Show more precision for smaller numbers or when converting
    return Number(temp.toFixed(2)).toString(); 
  };


  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Enter a temperature in any field (Celsius, Fahrenheit, or Kelvin), and the other fields will update automatically.
      </p>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Thermometer className="mr-2 h-6 w-6 text-primary" /> Temperature Converter</CardTitle>
          <CardDescription>Input a value in one field to see conversions in others.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="celsiusInput">Celsius (°C)</Label>
            <Input
              id="celsiusInput"
              type="number"
              value={celsius}
              onChange={(e) => handleInputChange(e.target.value, 'Celsius')}
              placeholder="e.g., 0"
              className="text-lg"
            />
          </div>
          <div>
            <Label htmlFor="fahrenheitInput">Fahrenheit (°F)</Label>
            <Input
              id="fahrenheitInput"
              type="number"
              value={fahrenheit}
              onChange={(e) => handleInputChange(e.target.value, 'Fahrenheit')}
              placeholder="e.g., 32"
              className="text-lg"
            />
          </div>
          <div>
            <Label htmlFor="kelvinInput">Kelvin (K)</Label>
            <Input
              id="kelvinInput"
              type="number"
              value={kelvin}
              onChange={(e) => handleInputChange(e.target.value, 'Kelvin')}
              placeholder="e.g., 273.15"
              className="text-lg"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-secondary/30">
        <CardHeader>
            <CardTitle className="text-xl">Conversion Formulas</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-1">
            <p><strong>Fahrenheit to Celsius:</strong> (°F - 32) × 5/9 = °C</p>
            <p><strong>Celsius to Fahrenheit:</strong> (°C × 9/5) + 32 = °F</p>
            <p><strong>Celsius to Kelvin:</strong> °C + 273.15 = K</p>
            <p><strong>Kelvin to Celsius:</strong> K - 273.15 = °C</p>
        </CardContent>
      </Card>
    </div>
  );
}
