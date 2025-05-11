
"use client";

import { useState, type ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CalendarClock, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format, isValid } from 'date-fns';

export function EpochToHumanDateConverterTool() {
  const [epochInput, setEpochInput] = useState<string>('');
  const [humanDate, setHumanDate] = useState<string | null>(null);
  const [isMilliseconds, setIsMilliseconds] = useState<boolean>(false);
  const { toast } = useToast();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEpochInput(e.target.value);
    setHumanDate(null);
  };

  const handleDetectUnit = () => {
    const value = parseInt(epochInput, 10);
    if (isNaN(value)) return;

    // Heuristic: If the number is very large (typically 13 digits or more for current dates),
    // it's likely milliseconds. Otherwise, assume seconds.
    // Current seconds epoch is ~1.7 billion (10 digits). Current ms epoch is ~1.7 trillion (13 digits).
    if (epochInput.length >= 13 && value > 315576000000) { // A date around 1980 in ms
        setIsMilliseconds(true);
    } else {
        setIsMilliseconds(false);
    }
  }

  const handleConvert = () => {
    if (!epochInput.trim()) {
      toast({ title: 'Input Empty', description: 'Please enter an Epoch timestamp.', variant: 'destructive' });
      setHumanDate(null);
      return;
    }

    const value = parseInt(epochInput, 10);
    if (isNaN(value)) {
      toast({ title: 'Invalid Input', description: 'Epoch timestamp must be a number.', variant: 'destructive' });
      setHumanDate(null);
      return;
    }
    
    handleDetectUnit(); // Auto-detect before conversion if not manually set

    const date = new Date(isMilliseconds ? value : value * 1000);

    if (!isValid(date)) {
      toast({ title: 'Invalid Date', description: 'The Epoch timestamp results in an invalid date.', variant: 'destructive' });
      setHumanDate(null);
      return;
    }
    
    // Format: "Saturday, March 14, 2020 10:30 AM (UTC)"
    // Also show local time
    const utcDateString = `${format(date, "PPPP p")} (UTC)`;
    const localDateString = `${format(date, "PPPP p")} (Local: ${format(date, "zzz")})`;


    setHumanDate(`${utcDateString}\n${localDateString}`);
    toast({ title: 'Conversion Successful', description: 'Epoch timestamp converted to human-readable date.' });
  };
  
  const fillCurrentEpoch = () => {
    const now = Math.floor(Date.now() / (isMilliseconds ? 1 : 1000));
    setEpochInput(now.toString());
    setHumanDate(null);
  }

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Convert a Unix Epoch timestamp (seconds or milliseconds since January 1, 1970 UTC) into a human-readable date and time format.
        The tool attempts to auto-detect if the input is in seconds or milliseconds.
      </p>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div>
            <Label htmlFor="epochInput">Epoch Timestamp</Label>
            <div className="flex gap-2">
                <Input
                id="epochInput"
                type="number"
                value={epochInput}
                onChange={handleInputChange}
                placeholder="e.g., 1609459200"
                />
                <Button variant="outline" onClick={fillCurrentEpoch}>Now</Button>
            </div>
          </div>
          
          {/* Optional: Manual toggle for seconds/milliseconds if auto-detection isn't sufficient */}
          {/* <div className="flex items-center space-x-2">
            <Switch id="isMilliseconds" checked={isMilliseconds} onCheckedChange={setIsMilliseconds} />
            <Label htmlFor="isMilliseconds">Timestamp is in Milliseconds</Label>
          </div> */}

          <Button onClick={handleConvert} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
            <Wand2 className="mr-2 h-4 w-4" /> Convert to Date
          </Button>
        </CardContent>
      </Card>

      {humanDate !== null && (
        <Card className="bg-secondary/30">
          <CardHeader>
            <CardTitle>Human-Readable Date</CardTitle>
            <CardDescription>The converted date and time from the Epoch timestamp.</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="text-lg font-semibold text-primary whitespace-pre-wrap p-4 bg-background rounded-md">
              {humanDate}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
