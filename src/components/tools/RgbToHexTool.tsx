"use client";

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Copy, Shuffle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

function componentToHex(c: number): string {
  const C = Math.max(0, Math.min(255, c)); // Ensure value is between 0 and 255
  const hex = C.toString(16);
  return hex.length === 1 ? "0" + hex : hex;
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

export function RgbToHexTool() {
  const [rValue, setRValue] = useState(52);
  const [gValue, setGValue] = useState(152);
  const [bValue, setBValue] = useState(219);
  const [hexResult, setHexResult] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const hex = rgbToHex(rValue, gValue, bValue);
    setHexResult(hex.toUpperCase());
  }, [rValue, gValue, bValue]);

  const handleCopy = () => {
    navigator.clipboard.writeText(hexResult);
    toast({ title: "HEX Copied!", description: hexResult });
  };

  const handleColorChange = (setter: React.Dispatch<React.SetStateAction<number>>, value: string) => {
    const numValue = parseInt(value, 10);
    if (isNaN(numValue)) {
      setter(0); // Default to 0 if input is not a number
    } else {
      setter(Math.max(0, Math.min(255, numValue)));
    }
  };

  return (
    <div className="space-y-6">
       <p className="text-muted-foreground">
        Enter RGB values (0-255 for each component) to convert them into a HEX color code.
      </p>
      <div className="grid md:grid-cols-2 gap-6 items-start">
        <Card className="bg-secondary/30">
          <CardContent className="p-6 space-y-4">
            <div>
              <Label htmlFor="r-value">Red (R)</Label>
              <Input
                id="r-value"
                type="number"
                min="0"
                max="255"
                value={rValue}
                onChange={(e) => handleColorChange(setRValue, e.target.value)}
                className="bg-background"
              />
            </div>
            <div>
              <Label htmlFor="g-value">Green (G)</Label>
              <Input
                id="g-value"
                type="number"
                min="0"
                max="255"
                value={gValue}
                onChange={(e) => handleColorChange(setGValue, e.target.value)}
                className="bg-background"
              />
            </div>
            <div>
              <Label htmlFor="b-value">Blue (B)</Label>
              <Input
                id="b-value"
                type="number"
                min="0"
                max="255"
                value={bValue}
                onChange={(e) => handleColorChange(setBValue, e.target.value)}
                className="bg-background"
              />
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-4">
          <div
            className="w-full h-32 rounded-lg border border-border shadow-inner"
            style={{ backgroundColor: hexResult }}
            aria-live="polite"
            aria-label={`Color preview: ${hexResult}`}
           />
          <Card>
            <CardContent className="p-6">
              <Label htmlFor="hex-result">HEX Result</Label>
              <div className="flex items-center">
                <Input id="hex-result" value={hexResult} readOnly className="text-lg font-mono bg-background"/>
                <Button variant="ghost" size="icon" onClick={handleCopy} aria-label="Copy HEX result">
                  <Copy className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
