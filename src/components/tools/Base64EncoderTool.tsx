
"use client";

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Copy, Wand2, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export function Base64EncoderTool() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const { toast } = useToast();

  const handleEncode = () => {
    if (!inputText.trim()) {
      setOutputText('');
      toast({ title: 'Input is empty', description: 'Please enter some text to encode.', variant: 'default' });
      return;
    }
    try {
      const encoded = btoa(unescape(encodeURIComponent(inputText))); // Handle UTF-8 characters
      setOutputText(encoded);
      toast({ title: 'Text Encoded!', description: 'Your text has been successfully encoded to Base64.' });
    } catch (e: any) {
      setOutputText('');
      toast({ title: 'Encoding Error', description: 'Could not encode the text. Ensure it is valid.', variant: 'destructive' });
      console.error("Base64 Encoding Error:", e);
    }
  };

  const handleCopy = () => {
    if (!outputText) {
      toast({ title: 'Nothing to copy', description: 'Output is empty.', variant: 'destructive' });
      return;
    }
    navigator.clipboard.writeText(outputText);
    toast({ title: 'Copied to clipboard!', description: 'Base64 encoded text has been copied.' });
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Enter plain text in the input field to convert it into a Base64 encoded string. This tool handles UTF-8 characters correctly.
      </p>
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Input Text</CardTitle>
            <CardDescription>Text to be encoded.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              id="input-text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type or paste your text here..."
              rows={8}
              className="text-base"
            />
          </CardContent>
        </Card>
        <Card className="bg-secondary/30">
          <CardHeader>
            <CardTitle>Base64 Output</CardTitle>
            <CardDescription>Encoded string.</CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <Textarea
              id="output-text"
              value={outputText}
              readOnly
              placeholder="Base64 encoded text will appear here..."
              rows={8}
              className="text-base bg-background"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              className="absolute top-3 right-3"
              aria-label="Copy output text"
              disabled={!outputText}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={handleEncode} className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Wand2 className="mr-2 h-4 w-4" /> Encode to Base64
        </Button>
        <Button onClick={handleClear} variant="outline">
          <Trash2 className="mr-2 h-4 w-4" /> Clear
        </Button>
      </div>
    </div>
  );
}
