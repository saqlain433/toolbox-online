
"use client";

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Copy, Repeat, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';

export function TextRepeaterTool() {
  const [inputText, setInputText] = useState('');
  const [repeatCount, setRepeatCount] = useState(5);
  const [outputText, setOutputText] = useState('');
  const [separator, setSeparator] = useState(' '); // Newline, space, or custom
  const { toast } = useToast();

  const handleRepeat = () => {
    if (!inputText.trim()) {
      toast({ title: 'Input is empty', description: 'Please enter some text to repeat.', variant: 'default' });
      setOutputText('');
      return;
    }
    if (repeatCount <= 0 || repeatCount > 1000) { // Added upper limit for performance
      toast({ title: 'Invalid repeat count', description: 'Please enter a number between 1 and 1000.', variant: 'destructive' });
      return;
    }

    const repeatedArray = Array(repeatCount).fill(inputText);
    let currentSeparator = separator;
    if (separator === '\\n') {
      currentSeparator = '\n';
    }


    setOutputText(repeatedArray.join(currentSeparator));
    toast({ title: 'Text Repeated!', description: `Text repeated ${repeatCount} times.` });
  };

  const handleCopy = () => {
    if (!outputText) {
      toast({ title: 'Nothing to copy', description: 'Output is empty.', variant: 'destructive' });
      return;
    }
    navigator.clipboard.writeText(outputText);
    toast({ title: 'Copied to clipboard!', description: 'Repeated text has been copied.' });
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
    setRepeatCount(5);
    setSeparator(' ');
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Enter the text you want to repeat, specify the number of repetitions and a separator.
      </p>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-2">
            <Label htmlFor="input-text">Text to Repeat</Label>
            <Textarea
            id="input-text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter text here..."
            rows={3}
            className="text-base"
            />
        </div>
        <div className="space-y-2">
          <Label htmlFor="repeat-count">Number of Repetitions</Label>
          <Input
            id="repeat-count"
            type="number"
            value={repeatCount}
            onChange={(e) => setRepeatCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
            min="1"
            max="1000"
            className="text-base"
          />
        </div>
      </div>
       <div>
            <Label htmlFor="separator">Separator</Label>
            <Input
              id="separator"
              type="text"
              value={separator}
              onChange={(e) => setSeparator(e.target.value)}
              placeholder="e.g., space, comma, or \n for newline"
              className="text-base"
            />
            <p className="text-xs text-muted-foreground mt-1">Use <code>\n</code> for newline. Default is a space.</p>
        </div>


      <div className="flex flex-wrap gap-2">
        <Button onClick={handleRepeat} className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Repeat className="mr-2 h-4 w-4" /> Repeat Text
        </Button>
        <Button onClick={handleClear} variant="outline">
          <Trash2 className="mr-2 h-4 w-4" /> Clear
        </Button>
      </div>

      {outputText && (
        <Card>
          <CardContent className="p-6">
            <Label htmlFor="output-text">Repeated Text</Label>
            <div className="relative">
              <Textarea
                id="output-text"
                value={outputText}
                readOnly
                placeholder="Repeated text will appear here..."
                rows={8}
                className="text-base bg-muted/50"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                className="absolute top-2 right-2"
                aria-label="Copy output text"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
