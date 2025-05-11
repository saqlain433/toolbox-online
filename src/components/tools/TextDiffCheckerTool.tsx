
"use client";

import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Shuffle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { diffChars, diffWords, diffLines, type Change } from 'diff';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type DiffMode = 'chars' | 'words' | 'lines';

interface DiffSegment {
  value: string;
  added?: boolean;
  removed?: boolean;
}

export function TextDiffCheckerTool() {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [diffResult, setDiffResult] = useState<DiffSegment[]>([]);
  const [diffMode, setDiffMode] = useState<DiffMode>('lines');
  const { toast } = useToast();

  const calculateDiff = () => {
    if (!text1.trim() && !text2.trim()) {
      toast({ title: 'Input is empty', description: 'Please enter text in at least one field.', variant: 'default' });
      setDiffResult([]);
      return;
    }

    let changes: Change[];
    switch (diffMode) {
      case 'chars':
        changes = diffChars(text1, text2);
        break;
      case 'words':
        changes = diffWords(text1, text2, { ignoreWhitespace: false }); // Keep whitespace for words to be accurate
        break;
      case 'lines':
      default:
        changes = diffLines(text1, text2);
        break;
    }
    
    setDiffResult(changes as DiffSegment[]); // Cast because diff library types are slightly different
    toast({ title: 'Comparison Complete!', description: 'Differences have been highlighted.' });
  };

  const handleClear = () => {
    setText1('');
    setText2('');
    setDiffResult([]);
  };
  
  const renderDiff = () => {
    if (diffResult.length === 0 && (text1.trim() || text2.trim())) {
        return <p className="text-green-500 p-4 bg-green-500/10 rounded-md">No differences found.</p>;
    }
    return diffResult.map((part, index) => {
      const style = {
        backgroundColor: part.added ? 'hsl(var(--accent)/0.2)' : part.removed ? 'hsl(var(--destructive)/0.2)' : 'transparent',
        color: part.added ? 'hsl(var(--accent))' : part.removed ? 'hsl(var(--destructive))' : 'hsl(var(--foreground))',
        padding: '0.1em 0',
        textDecoration: part.removed ? 'line-through' : 'none',
        display: diffMode === 'lines' && !part.added && !part.removed ? 'block' : 'inline', // Ensure lines break
      };
      // For lines mode, ensure newlines are rendered correctly
      const value = diffMode === 'lines' ? part.value.replace(/\n$/, '\u21B5\n') : part.value; 
      return <span key={index} style={style}>{value}</span>;
    });
  };


  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Paste your two texts into the fields below to compare them and highlight the differences.
        Choose the comparison mode (characters, words, or lines).
      </p>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="text1-input">Original Text (Text 1)</Label>
          <Textarea
            id="text1-input"
            value={text1}
            onChange={(e) => setText1(e.target.value)}
            placeholder="Paste the first text here..."
            rows={12}
            className="text-base font-mono"
          />
        </div>
        <div>
          <Label htmlFor="text2-input">Changed Text (Text 2)</Label>
          <Textarea
            id="text2-input"
            value={text2}
            onChange={(e) => setText2(e.target.value)}
            placeholder="Paste the second text here..."
            rows={12}
            className="text-base font-mono"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="flex-grow">
            <Label htmlFor="diff-mode">Comparison Mode</Label>
            <Select value={diffMode} onValueChange={(value: string) => setDiffMode(value as DiffMode)}>
            <SelectTrigger id="diff-mode">
                <SelectValue placeholder="Select mode" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="lines">Lines</SelectItem>
                <SelectItem value="words">Words</SelectItem>
                <SelectItem value="chars">Characters</SelectItem>
            </SelectContent>
            </Select>
        </div>
        <div className="flex gap-2 mt-2 sm:mt-6">
            <Button onClick={calculateDiff} className="bg-accent hover:bg-accent/90 text-accent-foreground flex-1 sm:flex-none">
            <Shuffle className="mr-2 h-4 w-4" /> Compare Texts
            </Button>
            <Button onClick={handleClear} variant="outline" className="flex-1 sm:flex-none">
            <Trash2 className="mr-2 h-4 w-4" /> Clear All
            </Button>
        </div>
      </div>

      {diffResult.length > 0 || (text1.trim() || text2.trim()) ? (
        <Card>
          <CardHeader>
            <CardTitle>Differences</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="p-4 bg-muted/30 rounded-md overflow-x-auto whitespace-pre-wrap break-words text-sm font-mono">
              {renderDiff()}
            </pre>
             <div className="mt-4 space-x-4 text-sm">
                <span className="inline-flex items-center">
                    <span className="w-3 h-3 rounded-sm mr-1" style={{backgroundColor: 'hsl(var(--accent)/0.2)'}}></span> Added
                </span>
                <span className="inline-flex items-center">
                    <span className="w-3 h-3 rounded-sm mr-1" style={{backgroundColor: 'hsl(var(--destructive)/0.2)'}}></span> Removed
                </span>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
