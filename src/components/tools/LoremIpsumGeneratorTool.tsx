
"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const LOREM_WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do", "eiusmod",
  "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua", "enim", "ad", "minim", "veniam",
  "quis", "nostrud", "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
  "consequat", "duis", "aute", "irure", "reprehenderit", "voluptate", "velit", "esse", "cillum", "fugiat",
  "nulla", "pariatur", "excepturi", "sint", "occaecat", "cupidatat", "non", "proident", "sunt", "culpa",
  "qui", "officia", "deserunt", "mollit", "anim", "id", "est", "laborum"
];

function getRandomWord(): string {
  return LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];
}

function generateSentence(wordCount: number): string {
  let sentence = "";
  for (let i = 0; i < wordCount; i++) {
    sentence += getRandomWord() + " ";
  }
  return sentence.trimEnd().charAt(0).toUpperCase() + sentence.slice(1) + ".";
}

function generateParagraph(sentenceCount: number, wordsPerSentence: number): string {
  let paragraph = "";
  for (let i = 0; i < sentenceCount; i++) {
    paragraph += generateSentence(wordsPerSentence) + " ";
  }
  return paragraph.trimEnd();
}

export function LoremIpsumGeneratorTool() {
  const [count, setCount] = useState(5);
  const [type, setType] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [generatedText, setGeneratedText] = useState('');
  const { toast } = useToast();

  const handleGenerate = () => {
    let text = '';
    const numCount = Number(count);
    if (isNaN(numCount) || numCount <= 0) {
        toast({ title: 'Invalid count', description: 'Please enter a positive number.', variant: 'destructive' });
        return;
    }

    switch (type) {
      case 'paragraphs':
        for (let i = 0; i < numCount; i++) {
          text += generateParagraph(Math.floor(Math.random() * 5) + 3, Math.floor(Math.random() * 10) + 8) + "\n\n";
        }
        break;
      case 'sentences':
        for (let i = 0; i < numCount; i++) {
          text += generateSentence(Math.floor(Math.random() * 10) + 8) + " ";
        }
        break;
      case 'words':
        for (let i = 0; i < numCount; i++) {
          text += getRandomWord() + " ";
        }
        text = text.trimEnd().charAt(0).toUpperCase() + text.slice(1) + ".";
        break;
    }
    setGeneratedText(text.trim());
  };

  const handleCopy = () => {
    if (!generatedText) {
      toast({ title: 'Nothing to copy', description: 'Generate some text first.', variant: 'destructive' });
      return;
    }
    navigator.clipboard.writeText(generatedText);
    toast({ title: 'Copied to clipboard!', description: 'Lorem Ipsum text has been copied.' });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
        <div>
          <Label htmlFor="count">Number of</Label>
          <Input
            id="count"
            type="number"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            min="1"
          />
        </div>
        <div>
          <Label htmlFor="type">Type</Label>
          <Select value={type} onValueChange={(value: 'paragraphs' | 'sentences' | 'words') => setType(value)}>
            <SelectTrigger id="type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="paragraphs">Paragraphs</SelectItem>
              <SelectItem value="sentences">Sentences</SelectItem>
              <SelectItem value="words">Words</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button onClick={handleGenerate} className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
        <Wand2 className="mr-2 h-4 w-4" /> Generate
      </Button>

      {generatedText && (
        <div>
          <Label htmlFor="generated-text">Generated Lorem Ipsum</Label>
          <div className="relative">
            <Textarea
              id="generated-text"
              value={generatedText}
              readOnly
              rows={10}
              className="text-base bg-muted/50"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              className="absolute top-2 right-2"
              aria-label="Copy generated text"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
