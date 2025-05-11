
"use client";

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function CaseConverterTool() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const { toast } = useToast();

  const toUpperCase = () => setOutputText(inputText.toUpperCase());
  const toLowerCase = () => setOutputText(inputText.toLowerCase());
  
  const toTitleCase = () => {
    setOutputText(
      inputText.toLowerCase().replace(/\b\w/g, char => char.toUpperCase())
    );
  };

  const toSentenceCase = () => {
    setOutputText(
      inputText.toLowerCase().replace(/(^\w|\.\s*\w)/gm, char => char.toUpperCase())
    );
  };

  const handleCopy = () => {
    if (!outputText) {
      toast({ title: 'Nothing to copy', description: 'Output is empty.', variant: 'destructive' });
      return;
    }
    navigator.clipboard.writeText(outputText);
    toast({ title: 'Copied to clipboard!', description: 'Converted text has been copied.' });
  };
  
  const clearText = () => {
    setInputText('');
    setOutputText('');
  }

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="input-text">Input Text</Label>
        <Textarea
          id="input-text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter your text here..."
          rows={6}
          className="text-base"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={toUpperCase}>UPPER CASE</Button>
        <Button onClick={toLowerCase}>lower case</Button>
        <Button onClick={toTitleCase}>Title Case</Button>
        <Button onClick={toSentenceCase}>Sentence case</Button>
        <Button onClick={clearText} variant="outline">Clear</Button>
      </div>

      <div>
        <Label htmlFor="output-text">Output Text</Label>
        <div className="relative">
          <Textarea
            id="output-text"
            value={outputText}
            readOnly
            placeholder="Converted text will appear here..."
            rows={6}
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
  );
}

