
"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calculator } from 'lucide-react';

type UnitSystem = 'metric' | 'imperial';

interface BmiResult {
  bmi: number;
  category: string;
  colorClass: string;
}

export function BmiCalculatorTool() {
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [heightInches, setHeightInches] = useState(''); // For imperial system
  const [result, setResult] = useState<BmiResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculateBmi = () => {
    setError(null);
    setResult(null);

    const h = parseFloat(height);
    const w = parseFloat(weight);
    const hIn = parseFloat(heightInches);

    if (unitSystem === 'metric') {
      if (isNaN(h) || isNaN(w) || h <= 0 || w <= 0) {
        setError('Please enter valid positive numbers for height (cm) and weight (kg).');
        return;
      }
      const heightInMeters = h / 100;
      const bmi = w / (heightInMeters * heightInMeters);
      setResult(getBmiCategory(bmi));
    } else { // Imperial
      if (isNaN(h) || isNaN(w) || h < 0 || w <= 0 || (h > 0 && (isNaN(hIn) || hIn < 0 || hIn >=12))) { // h can be 0 if only inches used
        setError('Please enter valid positive numbers for height (ft and inches) and weight (lbs). Inches should be less than 12.');
        return;
      }
      const totalHeightInInches = (h * 12) + (hIn || 0) ;
      if (totalHeightInInches <= 0) {
        setError('Total height must be positive.');
        return;
      }
      const bmi = (w / (totalHeightInInches * totalHeightInInches)) * 703;
      setResult(getBmiCategory(bmi));
    }
  };

  const getBmiCategory = (bmi: number): BmiResult => {
    let category = '';
    let colorClass = '';
    if (bmi < 18.5) {
      category = 'Underweight';
      colorClass = 'text-blue-500'; // Using direct Tailwind colors as this is specific visual feedback
    } else if (bmi < 25) {
      category = 'Normal weight';
      colorClass = 'text-green-500';
    } else if (bmi < 30) {
      category = 'Overweight';
      colorClass = 'text-yellow-500';
    } else {
      category = 'Obesity';
      colorClass = 'text-red-500';
    }
    return { bmi: parseFloat(bmi.toFixed(1)), category, colorClass };
  };
  
  const handleUnitChange = (value: UnitSystem) => {
    setUnitSystem(value);
    setHeight('');
    setWeight('');
    setHeightInches('');
    setResult(null);
    setError(null);
  }

  return (
    <div className="space-y-6">
       <p className="text-muted-foreground">
        Select your preferred unit system, enter your height and weight, then click "Calculate BMI".
      </p>
      <RadioGroup defaultValue="metric" onValueChange={(val) => handleUnitChange(val as UnitSystem)} className="flex space-x-4">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="metric" id="metric" />
          <Label htmlFor="metric">Metric (cm, kg)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="imperial" id="imperial" />
          <Label htmlFor="imperial">Imperial (ft, in, lbs)</Label>
        </div>
      </RadioGroup>

      <div className="grid md:grid-cols-2 gap-4">
        {unitSystem === 'metric' ? (
          <>
            <div>
              <Label htmlFor="height-metric">Height (cm)</Label>
              <Input id="height-metric" type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="e.g., 175" />
            </div>
            <div>
              <Label htmlFor="weight-metric">Weight (kg)</Label>
              <Input id="weight-metric" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="e.g., 70" />
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-2">
                 <div>
                    <Label htmlFor="height-ft">Height (ft)</Label>
                    <Input id="height-ft" type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="e.g., 5" />
                </div>
                 <div>
                    <Label htmlFor="height-in">Height (in)</Label>
                    <Input id="height-in" type="number" value={heightInches} onChange={(e) => setHeightInches(e.target.value)} placeholder="e.g., 9" max="11.99" step="0.01"/>
                </div>
            </div>
            <div>
              <Label htmlFor="weight-imperial">Weight (lbs)</Label>
              <Input id="weight-imperial" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="e.g., 150" />
            </div>
          </>
        )}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button onClick={calculateBmi} className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
        <Calculator className="mr-2 h-4 w-4" /> Calculate BMI
      </Button>

      {result && (
        <Card className="bg-secondary/30">
          <CardHeader>
            <CardTitle>Your BMI Result</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-2">
            <p className={`text-5xl font-bold ${result.colorClass}`}>{result.bmi}</p>
            <p className={`text-xl font-semibold ${result.colorClass}`}>{result.category}</p>
            <CardDescription>
                BMI is a screening tool. Consult a healthcare provider for a comprehensive health assessment.
            </CardDescription>
          </CardContent>
        </Card>
      )}
       <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-xl">BMI Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            <li>Underweight: &lt; 18.5</li>
            <li>Normal weight: 18.5 – 24.9</li>
            <li>Overweight: 25 – 29.9</li>
            <li>Obesity: 30 or greater</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
