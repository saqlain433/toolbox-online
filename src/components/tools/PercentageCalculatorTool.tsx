
"use client";

import { useState, type ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Percent, Calculator } from 'lucide-react';

type CalculationType = 'percentOf' | 'isWhatPercentOf' | 'percentChange';

interface CalculationMode {
  type: CalculationType;
  label: string;
  inputs: { id: string; label: string; placeholder: string }[];
  formula: (...args: number[]) => number | string;
  resultLabel: string;
}

const modes: CalculationMode[] = [
  {
    type: 'percentOf',
    label: 'What is X% of Y?',
    inputs: [
      { id: 'percent', label: 'Percentage (X)', placeholder: 'e.g., 20' },
      { id: 'total', label: 'Total Value (Y)', placeholder: 'e.g., 150' },
    ],
    formula: (percent, total) => (percent / 100) * total,
    resultLabel: 'Result:',
  },
  {
    type: 'isWhatPercentOf',
    label: 'X is what % of Y?',
    inputs: [
      { id: 'part', label: 'Part Value (X)', placeholder: 'e.g., 30' },
      { id: 'total', label: 'Total Value (Y)', placeholder: 'e.g., 150' },
    ],
    formula: (part, total) => (total === 0 ? 'Cannot divide by zero' : (part / total) * 100),
    resultLabel: 'Percentage:',
  },
  {
    type: 'percentChange',
    label: 'Percentage change from X to Y',
    inputs: [
      { id: 'initial', label: 'Initial Value (X)', placeholder: 'e.g., 100' },
      { id: 'final', label: 'Final Value (Y)', placeholder: 'e.g., 120' },
    ],
    formula: (initial, final) => (initial === 0 ? 'Initial value cannot be zero' : ((final - initial) / initial) * 100),
    resultLabel: 'Percentage Change:',
  },
];

export function PercentageCalculatorTool() {
  const [selectedMode, setSelectedMode] = useState<CalculationType>('percentOf');
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const currentMode = modes.find(m => m.type === selectedMode)!;

  const handleInputChange = (id: string, value: string) => {
    setInputValues(prev => ({ ...prev, [id]: value }));
    setResult(null); // Clear result on input change
    setError(null);
  };

  const handleCalculate = () => {
    setError(null);
    const numericInputs = currentMode.inputs.map(input => parseFloat(inputValues[input.id]));

    if (numericInputs.some(isNaN)) {
      setError('Please enter valid numbers in all fields.');
      setResult(null);
      return;
    }

    const calculationResult = currentMode.formula(...numericInputs);
    if (typeof calculationResult === 'string') { // Handles "Cannot divide by zero" etc.
      setError(calculationResult);
      setResult(null);
    } else {
      setResult(calculationResult.toFixed(2) + (currentMode.type !== 'percentOf' ? '%' : ''));
    }
  };
  
  const handleModeChange = (newMode: CalculationType) => {
    setSelectedMode(newMode);
    setInputValues({});
    setResult(null);
    setError(null);
  }

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Select a calculation type, enter the required values, and click "Calculate".
      </p>
      <div>
        <Label htmlFor="calc-type">Calculation Type</Label>
        <Select value={selectedMode} onValueChange={(val) => handleModeChange(val as CalculationType)}>
          <SelectTrigger id="calc-type">
            <SelectValue placeholder="Select calculation type" />
          </SelectTrigger>
          <SelectContent>
            {modes.map(mode => (
              <SelectItem key={mode.type} value={mode.type}>{mode.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {currentMode.inputs.map(input => (
          <div key={input.id}>
            <Label htmlFor={input.id}>{input.label}</Label>
            <Input
              id={input.id}
              type="number"
              value={inputValues[input.id] || ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(input.id, e.target.value)}
              placeholder={input.placeholder}
            />
          </div>
        ))}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button onClick={handleCalculate} className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
        <Calculator className="mr-2 h-4 w-4" /> Calculate
      </Button>

      {result && (
        <Card className="bg-secondary/30">
          <CardHeader>
            <CardTitle>{currentMode.resultLabel}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-primary">{result}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
