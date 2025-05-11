
"use client";

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Copy, Wand2, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export function Base64DecoderTool() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const { toast } = useToast();

  const handleDecode = () => {
    if (!inputText.trim()) {
      setOutputText('');
      toast({ title: 'Input is empty', description: 'Please enter some Base64 text to decode.', variant: 'default' });
      return;
    }
    try {
      const decoded = decodeURIComponent(escape(atob(inputText))); // Handle UTF-8 characters
      setOutputText(decoded);
      toast({ title: 'Text Decoded!', description: 'Your Base64 text has been successfully decoded.' });
    } catch (e: any) {
      setOutputText('');
      toast({ title: 'Decoding Error', description: 'Could not decode the text. Ensure it is a valid Base64 string.', variant: 'destructive' });
      console.error("Base64 Decoding Error:", e);
    }
  };

  const handleCopy = () => {
    if (!outputText) {
      toast({ title: 'Nothing to copy', description: 'Output is empty.', variant: 'destructive' });
      return;
    }
    navigator.clipboard.writeText(outputText);
    toast({ title: 'Copied to clipboard!', description: 'Decoded text has been copied.' });
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Enter a Base64 encoded string in the input field to convert it back to plain text. This tool handles UTF-8 characters correctly.
      </p>
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Base64 Input</CardTitle>
            <CardDescription>Base64 string to be decoded.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              id="input-text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste your Base64 encoded text here..."
              rows={8}
              className="text-base"
            />
          </CardContent>
        </Card>
        <Card className="bg-secondary/30">
          <CardHeader>
            <CardTitle>Decoded Output</CardTitle>
            <CardDescription>Plain text string.</CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <Textarea
              id="output-text"
              value={outputText}
              readOnly
              placeholder="Decoded text will appear here..."
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
        <Button onClick={handleDecode} className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Wand2 className="mr-2 h-4 w-4" /> Decode Base64
        </Button>
        <Button onClick={handleClear} variant="outline">
          <Trash2 className="mr-2 h-4 w-4" /> Clear
        </Button>
      </div>
    </div>
  );
}
