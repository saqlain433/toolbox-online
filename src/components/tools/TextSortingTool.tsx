
"use client";

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Copy, SortAsc, SortDesc, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

type SortOrder = 'asc' | 'desc';
type SortType = 'alpha' | 'length' | 'numeric';

export function TextSortingTool() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [sortType, setSortType] = useState<SortType>('alpha');
  const { toast } = useToast();

  const handleSort = () => {
    if (!inputText.trim()) {
      toast({ title: 'Input is empty', description: 'Please enter some text to sort.', variant: 'default' });
      setOutputText('');
      return;
    }

    let lines = inputText.split('\n').filter(line => line.trim() !== ''); // Filter out empty lines

    switch (sortType) {
      case 'alpha':
        lines.sort((a, b) => a.localeCompare(b));
        break;
      case 'length':
        lines.sort((a, b) => a.length - b.length);
        break;
      case 'numeric':
        lines.sort((a, b) => {
          const numA = parseFloat(a);
          const numB = parseFloat(b);
          if (isNaN(numA) && isNaN(numB)) return a.localeCompare(b); // Fallback to alpha for non-numeric
          if (isNaN(numA)) return 1; // Non-numeric lines after numeric
          if (isNaN(numB)) return -1;
          return numA - numB;
        });
        break;
    }

    if (sortOrder === 'desc') {
      lines.reverse();
    }

    setOutputText(lines.join('\n'));
    toast({ title: 'Text Sorted!', description: 'Lines have been sorted successfully.' });
  };

  const handleCopy = () => {
    if (!outputText) {
      toast({ title: 'Nothing to copy', description: 'Output is empty.', variant: 'destructive' });
      return;
    }
    navigator.clipboard.writeText(outputText);
    toast({ title: 'Copied to clipboard!', description: 'Sorted text has been copied.' });
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Paste your text below. Each line will be treated as an item to sort. Choose your sorting options.
      </p>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="input-text">Input Text (One item per line)</Label>
          <Textarea
            id="input-text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter text to sort, one item per line..."
            rows={10}
            className="text-base"
          />
        </div>
        <div>
          <Label htmlFor="output-text">Sorted Text</Label>
          <div className="relative">
            <Textarea
              id="output-text"
              value={outputText}
              readOnly
              placeholder="Sorted text will appear here..."
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

      <div className="space-y-4">
        <div>
          <Label className="mb-2 block">Sort Order</Label>
          <RadioGroup value={sortOrder} onValueChange={(value: string) => setSortOrder(value as SortOrder)} className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="asc" id="asc" />
              <Label htmlFor="asc">Ascending (A-Z, 0-9, Short-Long)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="desc" id="desc" />
              <Label htmlFor="desc">Descending (Z-A, 9-0, Long-Short)</Label>
            </div>
          </RadioGroup>
        </div>
        <div>
          <Label className="mb-2 block">Sort Type</Label>
           <RadioGroup value={sortType} onValueChange={(value: string) => setSortType(value as SortType)} className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="alpha" id="alpha" />
              <Label htmlFor="alpha">Alphabetical</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="length" id="length" />
              <Label htmlFor="length">By Length</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="numeric" id="numeric" />
              <Label htmlFor="numeric">Numeric (attempts number sort, then alpha)</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={handleSort} className="bg-accent hover:bg-accent/90 text-accent-foreground">
          {sortOrder === 'asc' ? <SortAsc className="mr-2 h-4 w-4" /> : <SortDesc className="mr-2 h-4 w-4" />}
          Sort Text
        </Button>
        <Button onClick={handleClear} variant="outline">
          <Trash2 className="mr-2 h-4 w-4" /> Clear
        </Button>
      </div>
    </div>
  );
}
