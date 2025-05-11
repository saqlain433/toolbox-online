
"use client";

import { useState, type ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Scale, Ruler, Beaker, RefreshCw, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type UnitCategory = 'Length' | 'Weight' | 'Volume';

interface UnitDefinition {
  label: string;
  factor: number; // Factor to convert to a base unit (e.g., meters, kilograms, liters)
}

const unitsConfig: Record<UnitCategory, Record<string, UnitDefinition>> = {
  Length: {
    meters: { label: 'Meters (m)', factor: 1 },
    kilometers: { label: 'Kilometers (km)', factor: 1000 },
    centimeters: { label: 'Centimeters (cm)', factor: 0.01 },
    millimeters: { label: 'Millimeters (mm)', factor: 0.001 },
    miles: { label: 'Miles (mi)', factor: 1609.34 },
    yards: { label: 'Yards (yd)', factor: 0.9144 },
    feet: { label: 'Feet (ft)', factor: 0.3048 },
    inches: { label: 'Inches (in)', factor: 0.0254 },
  },
  Weight: {
    kilograms: { label: 'Kilograms (kg)', factor: 1 },
    grams: { label: 'Grams (g)', factor: 0.001 },
    milligrams: { label: 'Milligrams (mg)', factor: 0.000001 },
    pounds: { label: 'Pounds (lb)', factor: 0.453592 },
    ounces: { label: 'Ounces (oz)', factor: 0.0283495 },
    metric_tons: { label: 'Metric Tons (t)', factor: 1000},
  },
  Volume: {
    liters: { label: 'Liters (L)', factor: 1 },
    milliliters: { label: 'Milliliters (mL)', factor: 0.001 },
    cubic_meters: { label: 'Cubic Meters (m³)', factor: 1000 },
    gallons_us: { label: 'US Gallons (gal)', factor: 3.78541 },
    quarts_us: { label: 'US Quarts (qt)', factor: 0.946353 },
    pints_us: { label: 'US Pints (pt)', factor: 0.473176},
    fluid_ounces_us: { label: 'US Fluid Ounces (fl oz)', factor: 0.0295735},
  },
};

const categoryIcons: Record<UnitCategory, JSX.Element> = {
    Length: <Ruler className="mr-2 h-5 w-5" />,
    Weight: <Scale className="mr-2 h-5 w-5" />,
    Volume: <Beaker className="mr-2 h-5 w-5" />,
}

export function UnitConverterTool() {
  const [category, setCategory] = useState<UnitCategory>('Length');
  const [inputValue, setInputValue] = useState<string>('1');
  const [fromUnit, setFromUnit] = useState<string>(Object.keys(unitsConfig.Length)[0]);
  const [toUnit, setToUnit] = useState<string>(Object.keys(unitsConfig.Length)[1]);
  const [result, setResult] = useState<string | null>(null);
  const { toast } = useToast();

  const currentUnits = unitsConfig[category];

  const handleCategoryChange = (newCategory: UnitCategory) => {
    setCategory(newCategory);
    setFromUnit(Object.keys(unitsConfig[newCategory])[0]);
    setToUnit(Object.keys(unitsConfig[newCategory])[1]);
    setResult(null);
    setInputValue('1');
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setResult(null);
  };

  const handleUnitChange = (type: 'from' | 'to', value: string) => {
    if (type === 'from') setFromUnit(value);
    else setToUnit(value);
    setResult(null);
  };
  
  const handleSwapUnits = () => {
    const tempFrom = fromUnit;
    setFromUnit(toUnit);
    setToUnit(tempFrom);
    // Trigger recalculation if there's already a result or valid input
    if (result !== null || (inputValue && !isNaN(parseFloat(inputValue)))) {
        const currentVal = parseFloat(inputValue);
        if (!isNaN(currentVal)) {
            const valueInBase = currentVal * currentUnits[toUnit].factor; // old from unit
            const convertedValue = valueInBase / currentUnits[tempFrom].factor; // old to unit
            setResult(Number(convertedValue.toFixed(6)).toString());
        }
    }
  };

  const handleConvert = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      toast({ title: 'Invalid Input', description: 'Please enter a valid number.', variant: 'destructive' });
      setResult(null);
      return;
    }

    if (!currentUnits[fromUnit] || !currentUnits[toUnit]) {
      toast({ title: 'Unit Error', description: 'Selected units are not valid for the category.', variant: 'destructive' });
      setResult(null);
      return;
    }
    
    if (fromUnit === toUnit) {
        setResult(value.toString());
        toast({ title: 'Same Units', description: 'Input and output units are the same.' });
        return;
    }

    const valueInBaseUnit = value * currentUnits[fromUnit].factor;
    const convertedValue = valueInBaseUnit / currentUnits[toUnit].factor;
    
    const formattedResult = Number(convertedValue.toFixed(6)).toString(); // Keep reasonable precision
    setResult(formattedResult);
    toast({ title: 'Conversion Successful', description: `${value} ${currentUnits[fromUnit].label} is ${formattedResult} ${currentUnits[toUnit].label}.` });
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Select a category (Length, Weight, Volume), enter a value, choose units, and convert.
      </p>

      <Card>
        <CardHeader>
            <CardTitle className="flex items-center">
                {categoryIcons[category]} {category} Converter
            </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div>
            <Label htmlFor="categorySelect">Category</Label>
            <Select value={category} onValueChange={(val) => handleCategoryChange(val as UnitCategory)}>
              <SelectTrigger id="categorySelect">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(unitsConfig).map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
              <Select value={fromUnit} onValueChange={(val) => handleUnitChange('from', val)}>
                <SelectTrigger id="fromUnit">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(currentUnits).map(([key, unitDef]) => (
                    <SelectItem key={key} value={key}>{unitDef.label}</SelectItem>
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
              <Select value={toUnit} onValueChange={(val) => handleUnitChange('to', val)}>
                <SelectTrigger id="toUnit">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(currentUnits).map(([key, unitDef]) => (
                    <SelectItem key={key} value={key}>{unitDef.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
             <div className="flex md:hidden items-center justify-center pt-2">
                <Button variant="outline" onClick={handleSwapUnits} aria-label="Swap units" className="w-full">
                    <RefreshCw className="mr-2 h-4 w-4" /> Swap Units
                </Button>
            </div>
          </div>
          <Button onClick={handleConvert} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
            <Wand2 className="mr-2 h-4 w-4" /> Convert
          </Button>
        </CardContent>
      </Card>

      {result !== null && (
        <Card className="bg-secondary/30">
          <CardHeader>
            <CardTitle>Conversion Result</CardTitle>
            <CardDescription>
              {inputValue} {currentUnits[fromUnit]?.label || ''} =
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary break-all">
              {result} {currentUnits[toUnit]?.label || ''}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
