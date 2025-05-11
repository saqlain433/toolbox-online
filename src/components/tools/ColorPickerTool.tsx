"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Helper function to convert HEX to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// Helper function to convert RGB to HSL
function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h=0, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function ColorPickerTool() {
  const [selectedColor, setSelectedColor] = useState('#3498db'); // Default to primary blue
  const [rgbValue, setRgbValue] = useState('');
  const [hslValue, setHslValue] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const rgb = hexToRgb(selectedColor);
    if (rgb) {
      setRgbValue(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`);
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      setHslValue(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`);
    }
  }, [selectedColor]);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: `${type} Copied!`, description: text });
  };

  return (
    <div className="space-y-6">
       <p className="text-muted-foreground">
        Use the color wheel to pick a color or enter a HEX value. The corresponding RGB and HSL values will be displayed.
      </p>
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="flex flex-col items-center space-y-4">
          <Label htmlFor="color-picker-input" className="text-lg font-medium">Select Color</Label>
          <Input
            id="color-picker-input"
            type="color"
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="w-48 h-48 p-0 border-none rounded-full cursor-pointer shadow-lg"
            aria-label="Color Picker"
          />
          <div
            className="w-full h-16 rounded-lg shadow-inner"
            style={{ backgroundColor: selectedColor }}
            aria-live="polite"
            aria-label={`Selected color preview: ${selectedColor}`}
          />
        </div>
        
        <Card className="bg-secondary/30">
          <CardContent className="p-6 space-y-4">
            <div>
              <Label htmlFor="hex-value">HEX Value</Label>
              <div className="flex items-center">
                <Input id="hex-value" value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)} className="bg-background"/>
                <Button variant="ghost" size="icon" onClick={() => handleCopy(selectedColor, 'HEX')} aria-label="Copy HEX value">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="rgb-value">RGB Value</Label>
              <div className="flex items-center">
                <Input id="rgb-value" value={rgbValue} readOnly className="bg-background"/>
                <Button variant="ghost" size="icon" onClick={() => handleCopy(rgbValue, 'RGB')} aria-label="Copy RGB value">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="hsl-value">HSL Value</Label>
              <div className="flex items-center">
                <Input id="hsl-value" value={hslValue} readOnly className="bg-background"/>
                <Button variant="ghost" size="icon" onClick={() => handleCopy(hslValue, 'HSL')} aria-label="Copy HSL value">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
