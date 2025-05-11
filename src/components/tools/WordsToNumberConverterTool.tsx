
"use client";

import { useState, type ChangeEvent } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calculator, Wand2, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const numberWords: Record<string, number> = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9,
  ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16,
  seventeen: 17, eighteen: 18, nineteen: 19,
  twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90
};

const magnitudeWords: Record<string, number> = {
  hundred: 100, thousand: 1000, million: 1000000, billion: 1000000000, trillion: 1000000000000
};

function wordsToNumber(text: string): number | string {
  const words = text.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/).filter(Boolean);
  if (words.length === 0) return "No valid words found.";

  let total = 0;
  let currentNumber = 0;
  let isNegative = false;

  if (words[0] === 'minus' || words[0] === 'negative') {
    isNegative = true;
    words.shift();
  }
  
  for (const word of words) {
    if (numberWords[word] !== undefined) {
      currentNumber += numberWords[word];
    } else if (magnitudeWords[word] !== undefined) {
      if (word === 'hundred') {
        currentNumber *= magnitudeWords[word];
      } else {
        total += currentNumber * magnitudeWords[word];
        currentNumber = 0;
      }
    } else if (word === 'and') {
      // "and" is often used but doesn't change value, e.g. "one hundred and twenty three"
      continue;
    }
     else {
      return `Unknown word: "${word}". Please use standard English number words.`;
    }
  }
  total += currentNumber;
  
  // Basic validation: if total is 0 but input was not "zero" or empty, something is wrong
  if (total === 0 && !words.includes('zero') && words.length > 0) {
      // Check if all words were unknown or if structure was odd
      let allKnown = true;
      for(const w of words) {
          if (numberWords[w] === undefined && magnitudeWords[w] === undefined && w !== 'and') {
              allKnown = false;
              break;
          }
      }
      if (allKnown && words.length > 0 && !words.includes('zero')) {
         return "Could not parse number structure. Please check input format.";
      }
  }


  return isNegative ? -total : total;
}


export function WordsToNumberConverterTool() {
  const [wordsInput, setWordsInput] = useState<string>('');
  const [numberOutput, setNumberOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setWordsInput(e.target.value);
    setNumberOutput(null);
    setError(null);
  };

  const handleConvert = () => {
    setError(null);
    if (!wordsInput.trim()) {
      toast({ title: 'Input Empty', description: 'Please enter number words.', variant: 'destructive' });
      setNumberOutput(null);
      return;
    }

    const result = wordsToNumber(wordsInput);
    if (typeof result === 'string') {
      setError(result); // Show error message from conversion function
      toast({ title: 'Conversion Error', description: result, variant: 'destructive' });
      setNumberOutput(null);
    } else {
      setNumberOutput(result.toString());
      toast({ title: 'Conversion Successful', description: 'Words converted to number.' });
    }
  };
  
  const handleCopy = () => {
    if (!numberOutput) {
      toast({ title: 'Nothing to copy', description: 'No number generated.', variant: 'destructive' });
      return;
    }
    navigator.clipboard.writeText(numberOutput);
    toast({ title: 'Copied to clipboard!', description: 'Number has been copied.' });
  };


  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Enter number words (e.g., "one hundred twenty-three", "negative five thousand") to convert them into digits.
        This tool supports basic English number words. Complex phrasing might not be parsed correctly.
      </p>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Calculator className="mr-2 h-6 w-6 text-primary"/> Words to Number</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="wordsInput">Number in Words</Label>
            <Textarea
              id="wordsInput"
              value={wordsInput}
              onChange={handleInputChange}
              placeholder="e.g., two thousand fifty seven"
              rows={4}
              className="text-lg"
            />
          </div>
          <Button onClick={handleConvert} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
            <Wand2 className="mr-2 h-4 w-4" /> Convert to Number
          </Button>
        </CardContent>
      </Card>

      {error && (
         <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive-foreground">{error}</p>
          </CardContent>
        </Card>
      )}

      {numberOutput !== null && !error && (
        <Card className="bg-secondary/30">
          <CardHeader>
            <CardTitle>Numerical Result</CardTitle>
            <CardDescription>The words <code className="font-mono bg-muted px-1 py-0.5 rounded">{wordsInput}</code> as a number:</CardDescription>
          </CardHeader>
          <CardContent className="relative">
             <Input
                type="text"
                value={numberOutput}
                readOnly
                className="text-3xl font-bold font-mono text-primary p-4 bg-background text-center"
              />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              className="absolute top-1/2 right-3 transform -translate-y-1/2"
              aria-label="Copy number"
              disabled={!numberOutput}
            >
              <Copy className="h-5 w-5" />
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
