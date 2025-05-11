"use client";

import { useState, useMemo, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export function WordCounterTool() {
  const [text, setText] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [charCountNoSpaces, setCharCountNoSpaces] = useState(0);
  const [sentenceCount, setSentenceCount] = useState(0);
  const [paragraphCount, setParagraphCount] = useState(0);


  useEffect(() => {
    // Word count (handles multiple spaces between words and leading/trailing spaces)
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(text.trim() === '' ? 0 : words.length);

    // Character count (including spaces)
    setCharCount(text.length);

    // Character count (excluding spaces)
    setCharCountNoSpaces(text.replace(/\s/g, '').length);
    
    // Sentence count (basic: counts '.', '!', '?')
    const sentences = text.match(/[^\.!\?]+[\.!\?]+/g);
    setSentenceCount(sentences ? sentences.length : 0);

    // Paragraph count (counts non-empty lines separated by one or more newlines)
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    setParagraphCount(text.trim() === '' ? 0 : paragraphs.length);

  }, [text]);

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="text-input" className="sr-only">Enter text here</Label>
        <Textarea
          id="text-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start typing or paste your text here..."
          rows={10}
          className="text-base resize-y"
        />
      </div>
      <Card className="bg-secondary/30">
        <CardContent className="p-6 grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
          <div className="p-4 bg-background rounded-lg shadow">
            <p className="text-sm text-muted-foreground">Words</p>
            <p className="text-2xl font-semibold text-primary">{wordCount}</p>
          </div>
          <div className="p-4 bg-background rounded-lg shadow">
            <p className="text-sm text-muted-foreground">Characters (with spaces)</p>
            <p className="text-2xl font-semibold text-primary">{charCount}</p>
          </div>
          <div className="p-4 bg-background rounded-lg shadow">
            <p className="text-sm text-muted-foreground">Characters (no spaces)</p>
            <p className="text-2xl font-semibold text-primary">{charCountNoSpaces}</p>
          </div>
          <div className="p-4 bg-background rounded-lg shadow">
            <p className="text-sm text-muted-foreground">Sentences</p>
            <p className="text-2xl font-semibold text-primary">{sentenceCount}</p>
          </div>
          <div className="p-4 bg-background rounded-lg shadow">
            <p className="text-sm text-muted-foreground">Paragraphs</p>
            <p className="text-2xl font-semibold text-primary">{paragraphCount}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
