
"use client";

import { useState, useEffect, useRef, type ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Play, Pause, RotateCcw, BellRing } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formatTime = (timeInSeconds: number): string => {
  if (timeInSeconds < 0) timeInSeconds = 0;
  const hours = String(Math.floor(timeInSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((timeInSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(timeInSeconds % 60).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

export function CountdownTimerTool() {
  const [initialTime, setInitialTime] = useState({ hours: 0, minutes: 5, seconds: 0 });
  const [remainingTime, setRemainingTime] = useState(initialTime.minutes * 60 + initialTime.seconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Preload audio
    if (typeof window !== "undefined") {
        audioRef.current = new Audio('/sounds/notification.mp3'); // Ensure this path is correct and file exists in public/sounds
        audioRef.current.load(); // Preload the audio
    }
  }, []);

  useEffect(() => {
    if (isRunning && remainingTime > 0) {
      timerRef.current = setInterval(() => {
        setRemainingTime(prevTime => prevTime - 1);
      }, 1000);
    } else if (remainingTime === 0 && isRunning) {
      setIsRunning(false);
      setIsFinished(true);
      if (timerRef.current) clearInterval(timerRef.current);
      toast({ title: "Time's Up!", description: "The countdown has finished.", variant: 'default' });
      audioRef.current?.play().catch(e => console.warn("Audio play failed:", e)); // Play sound
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, remainingTime, toast]);

  const handleTimeChange = (e: ChangeEvent<HTMLInputElement>, unit: 'hours' | 'minutes' | 'seconds') => {
    if (isRunning) return; // Don't allow changes while timer is running
    let value = parseInt(e.target.value, 10) || 0;
    if (unit === 'seconds' || unit === 'minutes') value = Math.max(0, Math.min(59, value));
    else if (unit === 'hours') value = Math.max(0, Math.min(99, value));

    setInitialTime(prev => ({ ...prev, [unit]: value }));
    setIsFinished(false); // Reset finished state on time change
  };
  
  useEffect(() => {
    if (!isRunning) { // Update remainingTime only if not running
        const newTotalSeconds = initialTime.hours * 3600 + initialTime.minutes * 60 + initialTime.seconds;
        setRemainingTime(newTotalSeconds);
    }
  }, [initialTime, isRunning]);


  const startTimer = () => {
    if (remainingTime > 0) {
      setIsRunning(true);
      setIsFinished(false);
    }
  };

  const pauseTimer = () => {
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsFinished(false);
    if (timerRef.current) clearInterval(timerRef.current);
    const newTotalSeconds = initialTime.hours * 3600 + initialTime.minutes * 60 + initialTime.seconds;
    setRemainingTime(newTotalSeconds);
    audioRef.current?.pause();
    if (audioRef.current) audioRef.current.currentTime = 0;
  };
  

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Set a countdown duration. The timer will notify you when the time is up.
      </p>
      <Card>
        <CardHeader>
          <CardTitle>Set Countdown Duration</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="hours">Hours</Label>
            <Input id="hours" type="number" value={String(initialTime.hours).padStart(2, '0')} onChange={e => handleTimeChange(e, 'hours')} min="0" max="99" disabled={isRunning} />
          </div>
          <div>
            <Label htmlFor="minutes">Minutes</Label>
            <Input id="minutes" type="number" value={String(initialTime.minutes).padStart(2, '0')} onChange={e => handleTimeChange(e, 'minutes')} min="0" max="59" disabled={isRunning} />
          </div>
          <div>
            <Label htmlFor="seconds">Seconds</Label>
            <Input id="seconds" type="number" value={String(initialTime.seconds).padStart(2, '0')} onChange={e => handleTimeChange(e, 'seconds')} min="0" max="59" disabled={isRunning} />
          </div>
        </CardContent>
      </Card>

      <Card className="text-center shadow-lg">
        <CardHeader>
          <CardTitle className={`text-6xl font-mono tracking-wider ${isFinished ? 'text-destructive' : 'text-primary'}`}>
            {formatTime(remainingTime)}
          </CardTitle>
          <CardDescription>Remaining Time (HH:MM:SS)</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center gap-4">
          {!isRunning ? (
            <Button onClick={startTimer} size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground" disabled={remainingTime === 0 && !isFinished}>
              <Play className="mr-2 h-5 w-5" /> Start
            </Button>
          ) : (
            <Button onClick={pauseTimer} size="lg" variant="outline">
              <Pause className="mr-2 h-5 w-5" /> Pause
            </Button>
          )}
          <Button onClick={resetTimer} size="lg" variant="destructive">
            <RotateCcw className="mr-2 h-5 w-5" /> Reset
          </Button>
        </CardContent>
      </Card>
      {isFinished && (
        <div className="text-center p-4 bg-destructive/10 rounded-md">
            <BellRing className="h-8 w-8 mx-auto text-destructive mb-2" />
            <p className="font-semibold text-destructive">Time's Up!</p>
        </div>
      )}
      <Card className="bg-secondary/30 mt-4">
        <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> A notification sound will play when the timer finishes if your browser and OS allow it. Ensure your volume is on.
            </p>
        </CardContent>
       </Card>
    </div>
  );
}
