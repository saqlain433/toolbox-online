
"use client";

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Copy, Wand2, Trash2, FileJson } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function JsonFormatterTool() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFormat = () => {
    setError(null);
    if (!inputText.trim()) {
      setOutputText('');
      toast({ title: 'Input is empty', description: 'Please enter some JSON to format.', variant: 'default' });
      return;
    }
    try {
      const jsonObj = JSON.parse(inputText);
      setOutputText(JSON.stringify(jsonObj, null, 2)); // 2 spaces for indentation
      toast({ title: 'JSON Formatted!', description: 'Your JSON has been successfully formatted.' });
    } catch (e: any) {
      setError(`Invalid JSON: ${e.message}`);
      setOutputText('');
      toast({ title: 'Formatting Error', description: 'Please provide valid JSON.', variant: 'destructive' });
    }
  };

  const handleMinify = () => {
    setError(null);
    if (!inputText.trim()) {
      setOutputText('');
      toast({ title: 'Input is empty', description: 'Please enter some JSON to minify.', variant: 'default' });
      return;
    }
    try {
      const jsonObj = JSON.parse(inputText);
      setOutputText(JSON.stringify(jsonObj));
      toast({ title: 'JSON Minified!', description: 'Your JSON has been successfully minified.' });
    } catch (e: any) {
      setError(`Invalid JSON: ${e.message}`);
      setOutputText('');
      toast({ title: 'Minifying Error', description: 'Please provide valid JSON.', variant: 'destructive' });
    }
  };

  const handleCopy = () => {
    if (!outputText) {
      toast({ title: 'Nothing to copy', description: 'Output is empty.', variant: 'destructive' });
      return;
    }
    navigator.clipboard.writeText(outputText);
    toast({ title: 'Copied to clipboard!', description: 'Processed JSON has been copied.' });
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
    setError(null);
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Paste your JSON data into the input field. You can then format it for readability or minify it to save space.
      </p>
      {error && (
        <Alert variant="destructive">
          <FileJson className="h-4 w-4" />
          <AlertTitle>JSON Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="input-json">Input JSON</Label>
          <Textarea
            id="input-json"
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              if (error) setError(null); // Clear error on input change
            }}
            placeholder='Paste your JSON here... e.g., {"name": "Toolbox", "version": 1}'
            rows={12}
            className="text-sm font-mono"
          />
        </div>
        <div>
          <Label htmlFor="output-json">Output JSON</Label>
          <div className="relative">
            <Textarea
              id="output-json"
              value={outputText}
              readOnly
              placeholder="Formatted or minified JSON will appear here..."
              rows={12}
              className="text-sm font-mono bg-muted/30"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              className="absolute top-2 right-2"
              aria-label="Copy output JSON"
              disabled={!outputText}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={handleFormat} className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Wand2 className="mr-2 h-4 w-4" /> Format
        </Button>
        <Button onClick={handleMinify} variant="secondary">
          Minify
        </Button>
        <Button onClick={handleClear} variant="outline">
          <Trash2 className="mr-2 h-4 w-4" /> Clear All
        </Button>
      </div>
    </div>
  );
}
