
"use client";

import { useState, type ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Type, Wand2, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Basic number to words converter
const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const thousands = ['', 'thousand', 'million', 'billion', 'trillion']; // Extend if needed

function convertChunkToWords(num: number): string {
  if (num === 0) return '';
  let words = '';
  if (num >= 100) {
    words += ones[Math.floor(num / 100)] + ' hundred ';
    num %= 100;
  }
  if (num >= 10 && num <= 19) {
    words += teens[num - 10] + ' ';
  } else {
    if (num >= 20) {
      words += tens[Math.floor(num / 10)] + ' ';
      num %= 10;
    }
    if (num >= 1 && num <= 9) {
      words += ones[num] + ' ';
    }
  }
  return words.trim();
}

function numberToWords(num: number): string {
  if (num === 0) return 'zero';
  if (num < 0) return 'minus ' + numberToWords(Math.abs(num));

  let words = '';
  let i = 0;

  // Cap at a reasonable number to prevent performance issues with extremely large numbers
  if (num > 999999999999999) { // Up to just under a quadrillion
    return "Number is too large to convert.";
  }


  do {
    const chunk = num % 1000;
    if (chunk !== 0) {
      const chunkWords = convertChunkToWords(chunk);
      words = chunkWords + (thousands[i] ? ' ' + thousands[i] : '') + (words ? ' ' + words : '');
    }
    num = Math.floor(num / 1000);
    i++;
  } while (num > 0);

  return words.trim().replace(/\s+/g, ' '); // Clean up extra spaces
}


export function NumberToWordsConverterTool() {
  const [numberInput, setNumberInput] = useState<string>('');
  const [wordsOutput, setWordsOutput] = useState<string | null>(null);
  const { toast } = useToast();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow digits, optional minus sign at the start
    if (/^-?\d*$/.test(value)) {
        setNumberInput(value);
    }
    setWordsOutput(null);
  };

  const handleConvert = () => {
    if (!numberInput.trim() && numberInput !== "0") { // Allow "0"
      toast({ title: 'Input Empty', description: 'Please enter a number.', variant: 'destructive' });
      setWordsOutput(null);
      return;
    }

    const num = parseInt(numberInput, 10);
    if (isNaN(num)) {
      toast({ title: 'Invalid Number', description: 'Please enter a valid integer.', variant: 'destructive' });
      setWordsOutput(null);
      return;
    }
    
    if (numberInput.length > 15 && (num > Number.MAX_SAFE_INTEGER || num < Number.MIN_SAFE_INTEGER) ) {
        toast({ title: 'Number Too Large', description: 'Number is too large/small for precise conversion.', variant: 'destructive' });
        setWordsOutput("Number is too large for precise conversion.");
        return;
    }


    const words = numberToWords(num);
    setWordsOutput(words.charAt(0).toUpperCase() + words.slice(1)); // Capitalize first letter
    toast({ title: 'Conversion Successful', description: 'Number converted to words.' });
  };

  const handleCopy = () => {
    if (!wordsOutput) {
      toast({ title: 'Nothing to copy', description: 'No words generated.', variant: 'destructive' });
      return;
    }
    navigator.clipboard.writeText(wordsOutput);
    toast({ title: 'Copied to clipboard!', description: 'Words have been copied.' });
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Enter an integer (e.g., 123, -456) to convert it into its English word representation (e.g., "One hundred twenty-three").
        Supports numbers up to a Trillion.
      </p>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Type className="mr-2 h-6 w-6 text-primary"/> Number to Words</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="numberInput">Number</Label>
            <Input
              id="numberInput"
              type="text" // Use text to handle negative and large numbers better than type="number"
              value={numberInput}
              onChange={handleInputChange}
              placeholder="e.g., 12345"
              className="font-mono text-lg"
            />
          </div>
          <Button onClick={handleConvert} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
            <Wand2 className="mr-2 h-4 w-4" /> Convert to Words
          </Button>
        </CardContent>
      </Card>

      {wordsOutput !== null && (
        <Card className="bg-secondary/30">
          <CardHeader>
            <CardTitle>Word Representation</CardTitle>
            <CardDescription>The number <code className="font-mono bg-muted px-1 py-0.5 rounded">{numberInput}</code> in words:</CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <Textarea
              value={wordsOutput}
              readOnly
              rows={3}
              className="text-lg bg-background resize-none"
              placeholder="Words will appear here..."
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              className="absolute top-3 right-3"
              aria-label="Copy words"
              disabled={!wordsOutput}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
