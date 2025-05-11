
"use client";

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function HexToRgbTool() {
  const [hexValue, setHexValue] = useState('#3498DB');
  const [rValue, setRValue] = useState(0);
  const [gValue, setGValue] = useState(0);
  const [bValue, setBValue] = useState(0);
  const [rgbString, setRgbString] = useState('');
  const [isValidHex, setIsValidHex] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const rgb = hexToRgb(hexValue);
    if (rgb) {
      setRValue(rgb.r);
      setGValue(rgb.g);
      setBValue(rgb.b);
      setRgbString(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`);
      setIsValidHex(true);
    } else {
      setRgbString('Invalid HEX');
      setIsValidHex(false);
    }
  }, [hexValue]);

  const handleCopy = () => {
    if (!isValidHex || !rgbString || rgbString === 'Invalid HEX') {
        toast({ title: 'Invalid RGB', description: 'Cannot copy invalid RGB value.', variant: 'destructive' });
        return;
    }
    navigator.clipboard.writeText(rgbString);
    toast({ title: 'RGB Copied!', description: rgbString });
  };
  
  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newHex = e.target.value;
    if (!newHex.startsWith('#')) {
      newHex = '#' + newHex;
    }
    setHexValue(newHex.toUpperCase());
  };


  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Enter a HEX color code (e.g., #3498DB or 3498DB) to convert it to RGB values.
      </p>
      <div className="grid md:grid-cols-2 gap-6 items-start">
        <Card className="bg-secondary/30">
          <CardContent className="p-6 space-y-4">
            <div>
              <Label htmlFor="hex-input">HEX Value</Label>
              <Input
                id="hex-input"
                type="text"
                value={hexValue}
                onChange={handleHexInputChange}
                placeholder="#RRGGBB"
                className={`bg-background ${!isValidHex && hexValue.length > 0 ? 'border-destructive focus-visible:ring-destructive' : ''}`}
              />
              {!isValidHex && hexValue.length > 0 && <p className="text-sm text-destructive mt-1">Invalid HEX format.</p>}
            </div>
            
            <div
                className="w-full h-20 rounded-lg border border-border shadow-inner mt-4"
                style={{ backgroundColor: isValidHex ? hexValue : 'transparent' }}
                aria-live="polite"
                aria-label={`Color preview: ${hexValue}`}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 space-y-4">
            <div>
              <Label htmlFor="r-output">Red (R)</Label>
              <Input id="r-output" value={isValidHex ? rValue : 'N/A'} readOnly className="bg-muted/30" />
            </div>
            <div>
              <Label htmlFor="g-output">Green (G)</Label>
              <Input id="g-output" value={isValidHex ? gValue : 'N/A'} readOnly className="bg-muted/30" />
            </div>
            <div>
              <Label htmlFor="b-output">Blue (B)</Label>
              <Input id="b-output" value={isValidHex ? bValue : 'N/A'} readOnly className="bg-muted/30" />
            </div>
             <div>
              <Label htmlFor="rgb-string-output">RGB String</Label>
              <div className="flex items-center">
                <Input id="rgb-string-output" value={rgbString} readOnly className="bg-muted/30" />
                <Button variant="ghost" size="icon" onClick={handleCopy} disabled={!isValidHex} aria-label="Copy RGB string">
                  <Copy className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
