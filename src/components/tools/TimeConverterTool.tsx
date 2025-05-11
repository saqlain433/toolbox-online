
"use client";

import { useState, type ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Clock, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type TimeUnit = 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'years';

const timeUnitsFactors: Record<TimeUnit, number> = {
  seconds: 1,
  minutes: 60,
  hours: 3600,
  days: 86400,
  weeks: 604800,
  months: 2629800, // Average month (365.25 / 12 * 86400)
  years: 31557600, // Average year (365.25 * 86400)
};

const unitLabels: Record<TimeUnit, string> = {
    seconds: "Seconds",
    minutes: "Minutes",
    hours: "Hours",
    days: "Days",
    weeks: "Weeks",
    months: "Months",
    years: "Years",
}

export function TimeConverterTool() {
  const [inputValue, setInputValue] = useState<string>('1');
  const [fromUnit, setFromUnit] = useState<TimeUnit>('hours');
  const [toUnit, setToUnit] = useState<TimeUnit>('minutes');
  const [result, setResult] = useState<string | null>(null);
  const { toast } = useToast();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setResult(null);
  };

  const handleUnitChange = (type: 'from' | 'to', value: TimeUnit) => {
    if (type === 'from') {
      setFromUnit(value);
    } else {
      setToUnit(value);
    }
    setResult(null);
  };

  const handleConvert = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      toast({ title: 'Invalid Input', description: 'Please enter a valid number.', variant: 'destructive' });
      setResult(null);
      return;
    }

    if (fromUnit === toUnit) {
      setResult(value.toString());
      toast({ title: 'Same Units', description: 'Input and output units are the same.' });
      return;
    }

    const valueInSeconds = value * timeUnitsFactors[fromUnit];
    const convertedValue = valueInSeconds / timeUnitsFactors[toUnit];
    
    // Format result to a reasonable number of decimal places
    const formattedResult = Number(convertedValue.toFixed(6)).toString();

    setResult(formattedResult);
    toast({ title: 'Conversion Successful', description: `${value} ${unitLabels[fromUnit]} is ${formattedResult} ${unitLabels[toUnit]}.` });
  };

  const handleSwapUnits = () => {
    const tempUnit = fromUnit;
    setFromUnit(toUnit);
    setToUnit(tempUnit);
    // If there's an input value, re-calculate with swapped units
    if (inputValue) {
        const value = parseFloat(inputValue);
        if (!isNaN(value)) {
            const valueInSeconds = value * timeUnitsFactors[toUnit]; // old fromUnit is now toUnit
            const convertedValue = valueInSeconds / timeUnitsFactors[fromUnit]; // old toUnit is now fromUnit
            const formattedResult = Number(convertedValue.toFixed(6)).toString();
            setResult(formattedResult);
        }
    }
  }

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Convert time values between different units like seconds, minutes, hours, days, weeks, months, and years.
      </p>
      
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <Label htmlFor="inputValue">Value</Label>
              <Input
                id="inputValue"
                type="number"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Enter value"
              />
            </div>
            <div>
              <Label htmlFor="fromUnit">From Unit</Label>
              <Select value={fromUnit} onValueChange={(val) => handleUnitChange('from', val as TimeUnit)}>
                <SelectTrigger id="fromUnit">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(unitLabels).map(([unit, label]) => (
                    <SelectItem key={unit} value={unit}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
             <div className="hidden md:flex items-center justify-center">
                <Button variant="ghost" size="icon" onClick={handleSwapUnits} aria-label="Swap units">
                    <RefreshCw className="h-5 w-5" />
                </Button>
            </div>
            <div>
              <Label htmlFor="toUnit">To Unit</Label>
              <Select value={toUnit} onValueChange={(val) => handleUnitChange('to', val as TimeUnit)}>
                <SelectTrigger id="toUnit">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(unitLabels).map(([unit, label]) => (
                    <SelectItem key={unit} value={unit}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex md:hidden items-center justify-center pt-2">
                <Button variant="outline" onClick={handleSwapUnits} aria-label="Swap units" className="w-full">
                    <RefreshCw className="mr-2 h-4 w-4" /> Swap Units
                </Button>
            </div>

          <Button onClick={handleConvert} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
            <Clock className="mr-2 h-4 w-4" /> Convert Time
          </Button>
        </CardContent>
      </Card>

      {result !== null && (
        <Card className="bg-secondary/30">
          <CardHeader>
            <CardTitle>Conversion Result</CardTitle>
            <CardDescription>
              {inputValue} {unitLabels[fromUnit]} =
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">
              {result} {unitLabels[toUnit]}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
