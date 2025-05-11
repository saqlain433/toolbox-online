
"use client";

import { useState, type ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Binary, ArrowRightLeft, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function BinaryToDecimalConverterTool() {
  const [binaryInput, setBinaryInput] = useState<string>('');
  const [decimalOutput, setDecimalOutput] = useState<string | null>(null);
  const { toast } = useToast();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only 0, 1, or empty string
    if (/^[01]*$/.test(value)) {
      setBinaryInput(value);
    }
    setDecimalOutput(null);
  };

  const handleConvert = () => {
    if (!binaryInput.trim()) {
      toast({ title: 'Input Empty', description: 'Please enter a binary number.', variant: 'destructive' });
      setDecimalOutput(null);
      return;
    }

    if (!/^[01]+$/.test(binaryInput)) {
      toast({ title: 'Invalid Binary', description: 'Binary numbers can only contain 0s and 1s.', variant: 'destructive' });
      setDecimalOutput(null);
      return;
    }
    
    // Prevent excessively long inputs that might freeze browser
    if (binaryInput.length > 53) { // Max safe integer in JS from binary is around 2^53 - 1
        toast({ title: 'Input Too Long', description: 'Binary input is too long for precise conversion.', variant: 'destructive' });
        setDecimalOutput(null);
        return;
    }


    const decimalValue = parseInt(binaryInput, 2);
    setDecimalOutput(decimalValue.toString());
    toast({ title: 'Conversion Successful', description: `Binary ${binaryInput} is Decimal ${decimalValue}.` });
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Enter a binary number (composed of 0s and 1s) to convert it into its decimal (base-10) equivalent.
      </p>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Binary className="mr-2 h-6 w-6 text-primary"/> Binary to Decimal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="binaryInput">Binary Number (Base-2)</Label>
            <Input
              id="binaryInput"
              type="text"
              value={binaryInput}
              onChange={handleInputChange}
              placeholder="e.g., 101101"
              className="font-mono text-lg"
              maxLength={64} // Practical limit for display and common usage
            />
          </div>
          <Button onClick={handleConvert} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
            <Wand2 className="mr-2 h-4 w-4" /> Convert to Decimal
          </Button>
        </CardContent>
      </Card>

      {decimalOutput !== null && (
        <Card className="bg-secondary/30">
          <CardHeader>
            <CardTitle>Decimal Result (Base-10)</CardTitle>
            <CardDescription>The decimal equivalent of the binary number <code className="font-mono bg-muted px-1 py-0.5 rounded">{binaryInput}</code>.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold font-mono text-primary p-4 bg-background rounded-md text-center">
              {decimalOutput}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
