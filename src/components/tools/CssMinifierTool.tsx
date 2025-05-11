
"use client";

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Copy, Wand2, Trash2, Minimize2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

function minifyCss(cssString: string): string {
  try {
    let minified = cssString;

    // Remove CSS comments (/* ... */)
    minified = minified.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
    
    // Remove unnecessary whitespace
    // Remove leading/trailing whitespace from lines
    minified = minified.split('\n').map(line => line.trim()).join('');
    // Collapse multiple whitespace characters into single space
    minified = minified.replace(/\s+/g, ' ');
    // Remove spaces around selectors, properties, and values where safe
    minified = minified.replace(/\s*([{};:,])\s*/g, '$1');
    // Remove trailing semicolons in blocks
    minified = minified.replace(/;}/g, '}');
    // Remove empty rulesets (this might be too aggressive or complex for simple regex)
    // minified = minified.replace(/[^{}]+\{\s*\}/g, '');

    return minified.trim();
  } catch (e: any) {
    console.error("CSS Minification Error:", e);
    throw new Error("Error minifying CSS: " + e.message);
  }
}

export function CssMinifierTool() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const { toast } = useToast();

  const handleMinify = () => {
    if (!inputText.trim()) {
      setOutputText('');
      toast({ title: 'Input is empty', description: 'Please enter some CSS to minify.', variant: 'default' });
      return;
    }
    try {
      const minifiedCss = minifyCss(inputText);
      setOutputText(minifiedCss);
      toast({ title: 'CSS Minified!', description: 'Your CSS has been successfully minified.' });
    } catch (e: any) {
      setOutputText('');
      toast({ title: 'Minification Error', description: e.message, variant: 'destructive' });
    }
  };

  const handleCopy = () => {
    if (!outputText) {
      toast({ title: 'Nothing to copy', description: 'Output is empty.', variant: 'destructive' });
      return;
    }
    navigator.clipboard.writeText(outputText);
    toast({ title: 'Copied to clipboard!', description: 'Minified CSS has been copied.' });
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Paste your CSS code to reduce its size by removing comments and unnecessary whitespace.
      </p>
      <Alert variant="default" className="bg-secondary/30">
          <Minimize2 className="h-4 w-4" />
          <AlertTitle>Note on Minification</AlertTitle>
          <AlertDescription>
            This tool performs basic minification. For complex stylesheets or production use, a dedicated build tool or library (e.g., csso, cssnano) is recommended for more robust optimization.
          </AlertDescription>
      </Alert>
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Input CSS</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              id="input-css"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="body {\n  color: blue; /* This is a comment */\n  font-size: 16px;\n}\n\na {\n  text-decoration: none;\n}"
              rows={12}
              className="text-sm font-mono"
            />
          </CardContent>
        </Card>
        <Card className="bg-secondary/30">
          <CardHeader>
            <CardTitle>Minified CSS</CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <Textarea
              id="output-css"
              value={outputText}
              readOnly
              placeholder="Minified CSS will appear here..."
              rows={12}
              className="text-sm font-mono bg-background"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              className="absolute top-3 right-3"
              aria-label="Copy output CSS"
              disabled={!outputText}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={handleMinify} className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Wand2 className="mr-2 h-4 w-4" /> Minify CSS
        </Button>
        <Button onClick={handleClear} variant="outline">
          <Trash2 className="mr-2 h-4 w-4" /> Clear All
        </Button>
      </div>
    </div>
  );
}
