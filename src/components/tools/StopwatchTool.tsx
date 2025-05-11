
"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Play, Pause, RotateCcw, Flag } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const formatTime = (timeInMilliseconds: number): string => {
  const milliseconds = String(Math.floor((timeInMilliseconds % 1000) / 10)).padStart(2, '0');
  const totalSeconds = Math.floor(timeInMilliseconds / 1000);
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = String(totalMinutes % 60).padStart(2, '0');
  const hours = String(Math.floor(totalMinutes / 60)).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}.${milliseconds}`;
};

export function StopwatchTool() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastTimestampRef = useRef<number | null>(null);

  const startTimer = useCallback(() => {
    setIsRunning(true);
    lastTimestampRef.current = performance.now();
    timerRef.current = setInterval(() => {
      const now = performance.now();
      const delta = now - (lastTimestampRef.current || now);
      lastTimestampRef.current = now;
      setTime(prevTime => prevTime + delta);
    }, 10); // Update every 10ms for smoother display
  }, []);

  const stopTimer = useCallback(() => {
    setIsRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    lastTimestampRef.current = null;
  }, []);

  const resetTimer = () => {
    stopTimer();
    setTime(0);
    setLaps([]);
  };

  const addLap = () => {
    if (isRunning) {
      setLaps(prevLaps => [...prevLaps, time]);
    }
  };

  useEffect(() => {
    return () => { // Cleanup on unmount
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        A simple stopwatch to measure elapsed time. You can start, stop, reset, and record lap times.
      </p>
      <Card className="text-center shadow-lg">
        <CardHeader>
          <CardTitle className="text-6xl font-mono text-primary tracking-wider">
            {formatTime(time)}
          </CardTitle>
          <CardDescription>Elapsed Time (HH:MM:SS.ms)</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center gap-4">
          {!isRunning ? (
            <Button onClick={startTimer} size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Play className="mr-2 h-5 w-5" /> Start
            </Button>
          ) : (
            <Button onClick={stopTimer} size="lg" variant="outline">
              <Pause className="mr-2 h-5 w-5" /> Pause
            </Button>
          )}
          <Button onClick={addLap} size="lg" variant="secondary" disabled={!isRunning && time === 0}>
            <Flag className="mr-2 h-5 w-5" /> Lap
          </Button>
          <Button onClick={resetTimer} size="lg" variant="destructive">
            <RotateCcw className="mr-2 h-5 w-5" /> Reset
          </Button>
        </CardContent>
      </Card>

      {laps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Lap Times</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-48 w-full rounded-md border p-2">
              <ul className="space-y-1">
                {laps.map((lapTime, index) => (
                  <li key={index} className="flex justify-between items-center p-2 bg-muted/50 rounded text-sm">
                    <span className="font-medium text-muted-foreground">Lap {laps.length - index}:</span>
                    <span className="font-mono text-foreground">{formatTime(lapTime - (laps[index-1] || 0) )}</span>
                    <span className="font-mono text-primary/80">({formatTime(lapTime)})</span>
                  </li>
                )).reverse()}
              </ul>
            </ScrollArea>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" onClick={() => setLaps([])}>Clear Laps</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
