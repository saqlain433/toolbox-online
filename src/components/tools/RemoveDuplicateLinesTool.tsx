
"use client";

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Copy, RemoveFormatting, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

export function RemoveDuplicateLinesTool() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [trimWhitespace, setTrimWhitespace] = useState(true);
  const { toast } = useToast();

  const handleRemoveDuplicates = () => {
    if (!inputText.trim()) {
      toast({ title: 'Input is empty', description: 'Please enter some text.', variant: 'default' });
      setOutputText('');
      return;
    }

    let lines = inputText.split('\n');
    
    if (trimWhitespace) {
      lines = lines.map(line => line.trim());
    }

    const uniqueLinesSet = new Set<string>();
    const resultLines: string[] = [];

    for (const line of lines) {
      const processedLine = caseSensitive ? line : line.toLowerCase();
      if (!uniqueLinesSet.has(processedLine)) {
        uniqueLinesSet.add(processedLine);
        resultLines.push(line); // Add original line to preserve casing if case-insensitive
      }
    }

    setOutputText(resultLines.join('\n'));
    toast({ title: 'Duplicates Removed!', description: 'Unique lines have been processed.' });
  };

  const handleCopy = () => {
    if (!outputText) {
      toast({ title: 'Nothing to copy', description: 'Output is empty.', variant: 'destructive' });
      return;
    }
    navigator.clipboard.writeText(outputText);
    toast({ title: 'Copied to clipboard!', description: 'Processed text has been copied.' });
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Paste your text below to remove any duplicate lines. Adjust options for case sensitivity and whitespace trimming.
      </p>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="input-text">Input Text</Label>
          <Textarea
            id="input-text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste text with duplicate lines here..."
            rows={10}
            className="text-base"
          />
        </div>
        <div>
          <Label htmlFor="output-text">Output Text (Unique Lines)</Label>
          <div className="relative">
            <Textarea
              id="output-text"
              value={outputText}
              readOnly
              placeholder="Text with duplicate lines removed will appear here..."
              rows={10}
              className="text-base bg-muted/50"
            />
             <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                className="absolute top-2 right-2"
                aria-label="Copy output text"
                disabled={!outputText}
              >
                <Copy className="h-4 w-4" />
              </Button>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
            <CardTitle className="text-lg">Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
                <Switch
                id="case-sensitive"
                checked={caseSensitive}
                onCheckedChange={setCaseSensitive}
                />
                <Label htmlFor="case-sensitive">Case Sensitive</Label>
            </div>
            <div className="flex items-center space-x-2">
                <Switch
                id="trim-whitespace"
                checked={trimWhitespace}
                onCheckedChange={setTrimWhitespace}
                />
                <Label htmlFor="trim-whitespace">Trim Whitespace from lines before comparison</Label>
            </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        <Button onClick={handleRemoveDuplicates} className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <RemoveFormatting className="mr-2 h-4 w-4" /> Remove Duplicates
        </Button>
        <Button onClick={handleClear} variant="outline">
          <Trash2 className="mr-2 h-4 w-4" /> Clear
        </Button>
      </div>
    </div>
  );
}
