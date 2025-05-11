
"use client";

import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export function CharacterCounterTool() {
  const [text, setText] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [charCountNoSpaces, setCharCountNoSpaces] = useState(0);

  useEffect(() => {
    setCharCount(text.length);
    setCharCountNoSpaces(text.replace(/\s/g, '').length);
  }, [text]);

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="text-input" className="sr-only">Enter text here</Label>
        <Textarea
          id="text-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start typing or paste your text here to count characters..."
          rows={10}
          className="text-base resize-y"
        />
      </div>
      <Card className="bg-secondary/30">
        <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          <div className="p-4 bg-background rounded-lg shadow">
            <p className="text-sm text-muted-foreground">Characters (with spaces)</p>
            <p className="text-2xl font-semibold text-primary">{charCount}</p>
          </div>
          <div className="p-4 bg-background rounded-lg shadow">
            <p className="text-sm text-muted-foreground">Characters (no spaces)</p>
            <p className="text-2xl font-semibold text-primary">{charCountNoSpaces}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
