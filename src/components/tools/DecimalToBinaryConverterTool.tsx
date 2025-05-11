
"use client";

import { useState, type ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Hash, ArrowRightLeft, Wand2 } from 'lucide-react'; // Hash for decimal, Binary was used for BtoD
import { useToast } from '@/hooks/use-toast';

export function DecimalToBinaryConverterTool() {
  const [decimalInput, setDecimalInput] = useState<string>('');
  const [binaryOutput, setBinaryOutput] = useState<string | null>(null);
  const { toast } = useToast();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
     // Allow only positive integers
    if (/^\d*$/.test(value)) {
      setDecimalInput(value);
    }
    setBinaryOutput(null);
  };

  const handleConvert = () => {
    if (!decimalInput.trim()) {
      toast({ title: 'Input Empty', description: 'Please enter a decimal number.', variant: 'destructive' });
      setBinaryOutput(null);
      return;
    }

    const decimalValue = parseInt(decimalInput, 10);
    if (isNaN(decimalValue) || decimalValue < 0) {
      toast({ title: 'Invalid Decimal', description: 'Please enter a non-negative integer.', variant: 'destructive' });
      setBinaryOutput(null);
      return;
    }
    
    if (decimalValue > Number.MAX_SAFE_INTEGER) {
        toast({ title: 'Input Too Large', description: 'Decimal input is too large for precise conversion.', variant: 'destructive' });
        setBinaryOutput(null);
        return;
    }


    const binaryValue = decimalValue.toString(2);
    setBinaryOutput(binaryValue);
    toast({ title: 'Conversion Successful', description: `Decimal ${decimalValue} is Binary ${binaryValue}.` });
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Enter a non-negative decimal number (base-10) to convert it into its binary (base-2) equivalent.
      </p>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Hash className="mr-2 h-6 w-6 text-primary"/> Decimal to Binary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="decimalInput">Decimal Number (Base-10)</Label>
            <Input
              id="decimalInput"
              type="text" // Using text to control input with regex for positive integers
              pattern="\d*"
              value={decimalInput}
              onChange={handleInputChange}
              placeholder="e.g., 45"
              className="font-mono text-lg"
            />
          </div>
          <Button onClick={handleConvert} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
            <Wand2 className="mr-2 h-4 w-4" /> Convert to Binary
          </Button>
        </CardContent>
      </Card>

      {binaryOutput !== null && (
        <Card className="bg-secondary/30">
          <CardHeader>
            <CardTitle>Binary Result (Base-2)</CardTitle>
            <CardDescription>The binary equivalent of the decimal number <code className="font-mono bg-muted px-1 py-0.5 rounded">{decimalInput}</code>.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold font-mono text-primary p-4 bg-background rounded-md text-center break-all">
              {binaryOutput}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
