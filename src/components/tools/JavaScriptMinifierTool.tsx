
"use client";

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Copy, Wand2, Trash2, Minimize2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

function minifyJavaScript(jsString: string): string {
  try {
    let minified = jsString;

    // Remove single-line comments (// ...)
    minified = minified.replace(/\/\/.*/g, '');
    
    // Remove multi-line comments (/* ... */)
    minified = minified.replace(/\/\*[\s\S]*?\*\//g, '');
    
    // Remove leading/trailing whitespace from each line
    minified = minified.split('\n').map(line => line.trim()).join('\n');
    
    // Collapse multiple whitespace characters (spaces, tabs) into single space, but preserve newlines for safety
    minified = minified.replace(/[ \t]+/g, ' ');

    // Remove newlines that are not strictly necessary (e.g., before or after { } ; ,)
    // This is very basic and can be error-prone. True JS parsing is needed for robust minification.
    minified = minified.replace(/\s*\n\s*/g, '\n'); // Consolidate newlines
    minified = minified.replace(/\n\s*([\{\}\;\,])\s*\n/g, '$1'); // Remove newlines around some operators if safe
    minified = minified.replace(/;\s*\n/g, ';');


    return minified.trim();
  } catch (e: any) {
    console.error("JavaScript Minification Error:", e);
    throw new Error("Error minifying JavaScript: " + e.message);
  }
}

export function JavaScriptMinifierTool() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const { toast } = useToast();

  const handleMinify = () => {
    if (!inputText.trim()) {
      setOutputText('');
      toast({ title: 'Input is empty', description: 'Please enter some JavaScript to minify.', variant: 'default' });
      return;
    }
    try {
      const minifiedJs = minifyJavaScript(inputText);
      setOutputText(minifiedJs);
      toast({ title: 'JavaScript Minified!', description: 'Your JavaScript has been (basically) minified.' });
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
    toast({ title: 'Copied to clipboard!', description: 'Minified JavaScript has been copied.' });
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Paste your JavaScript code to reduce its size by removing comments and some unnecessary whitespace.
      </p>
      <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Important Limitation</AlertTitle>
          <AlertDescription>
            This tool performs very basic JavaScript minification (comments, some whitespace). It does <strong>not</strong> perform advanced optimizations like variable renaming, dead code elimination, or tree shaking. 
            For production code, always use professional-grade minifiers like Terser, UglifyJS, or tools integrated into bundlers (Webpack, Rollup, Parcel). 
            Using this tool on complex code might break it. <strong>Test thoroughly!</strong>
          </AlertDescription>
      </Alert>
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Input JavaScript</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              id="input-js"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="function greet(name) {\n  // This is a comment\n  console.log('Hello, ' + name + '!');\n}\ngreet('World');"
              rows={12}
              className="text-sm font-mono"
            />
          </CardContent>
        </Card>
        <Card className="bg-secondary/30">
          <CardHeader>
            <CardTitle>Minified JavaScript</CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <Textarea
              id="output-js"
              value={outputText}
              readOnly
              placeholder="Minified JavaScript will appear here..."
              rows={12}
              className="text-sm font-mono bg-background"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              className="absolute top-3 right-3"
              aria-label="Copy output JavaScript"
              disabled={!outputText}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={handleMinify} className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Wand2 className="mr-2 h-4 w-4" /> Minify JavaScript
        </Button>
        <Button onClick={handleClear} variant="outline">
          <Trash2 className="mr-2 h-4 w-4" /> Clear All
        </Button>
      </div>
    </div>
  );
}
