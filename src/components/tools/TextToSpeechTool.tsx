"use client";

import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, StopCircle, Volume2, ChevronDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function TextToSpeechTool() {
  const [text, setText] = useState("Hello, welcome to Toolbox Online! Enjoy this Text to Speech tool.");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string | undefined>(undefined);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const { toast } = useToast();
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSpeechSynthesis(window.speechSynthesis);
    } else {
      toast({
        title: "Browser Not Supported",
        description: "Your browser does not support the Web Speech API.",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    if (!speechSynthesis) return;

    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
        // Try to set a default voice, preferring local English voices
        const defaultVoice = availableVoices.find(voice => voice.lang.includes('en') && voice.localService) || availableVoices[0];
        if (defaultVoice) {
          setSelectedVoice(defaultVoice.name);
        }
      }
    };

    loadVoices();
    // Some browsers load voices asynchronously.
    speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      speechSynthesis.cancel(); // Stop any ongoing speech when component unmounts
    };
  }, [speechSynthesis]);

  const handleSpeak = () => {
    if (!speechSynthesis || !text.trim()) return;

    if (isPaused) {
      speechSynthesis.resume();
      setIsPaused(false);
      setIsSpeaking(true);
      return;
    }

    speechSynthesis.cancel(); // Stop any previous speech

    const utterance = new SpeechSynthesisUtterance(text);
    if (selectedVoice) {
      const voice = voices.find(v => v.name === selectedVoice);
      if (voice) utterance.voice = voice;
    }
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event.error);
      toast({
        title: "Speech Error",
        description: `Could not play speech: ${event.error}`,
        variant: "destructive",
      });
      setIsSpeaking(false);
      setIsPaused(false);
    };

    speechSynthesis.speak(utterance);
  };

  const handlePause = () => {
    if (speechSynthesis && isSpeaking) {
      speechSynthesis.pause();
      setIsPaused(true);
      setIsSpeaking(false);
    }
  };

  const handleStop = () => {
    if (speechSynthesis) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Type or paste your text, choose a voice, and adjust settings to hear it spoken aloud.
      </p>
      <div>
        <Label htmlFor="tts-text">Text to Speak</Label>
        <Textarea
          id="tts-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text here..."
          rows={6}
          className="text-base"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="tts-voice">Voice</Label>
            <Select value={selectedVoice} onValueChange={setSelectedVoice} disabled={voices.length === 0}>
              <SelectTrigger id="tts-voice" className="w-full">
                <SelectValue placeholder="Select a voice..." />
              </SelectTrigger>
              <SelectContent>
                {voices.map(voice => (
                  <SelectItem key={voice.name} value={voice.name}>
                    {voice.name} ({voice.lang}) {voice.localService ? '(Local)' : ''}
                  </SelectItem>
                ))}
                {voices.length === 0 && <SelectItem value="loading" disabled>Loading voices...</SelectItem>}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="tts-rate">Rate: {rate.toFixed(1)}</Label>
            <Slider
              id="tts-rate"
              min={0.5}
              max={2}
              step={0.1}
              value={[rate]}
              onValueChange={([val]) => setRate(val)}
            />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <Label htmlFor="tts-pitch">Pitch: {pitch.toFixed(1)}</Label>
            <Slider
              id="tts-pitch"
              min={0}
              max={2}
              step={0.1}
              value={[pitch]}
              onValueChange={([val]) => setPitch(val)}
            />
          </div>
          <div>
            <Label htmlFor="tts-volume">Volume: {volume.toFixed(1)}</Label>
            <Slider
              id="tts-volume"
              min={0}
              max={1}
              step={0.1}
              value={[volume]}
              onValueChange={([val]) => setVolume(val)}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={handleSpeak} disabled={!text.trim() || (isSpeaking && !isPaused) || !speechSynthesis} className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Play className="mr-2 h-4 w-4" /> {isPaused ? 'Resume' : 'Speak'}
        </Button>
        <Button onClick={handlePause} disabled={!isSpeaking || isPaused || !speechSynthesis} variant="outline">
          <Pause className="mr-2 h-4 w-4" /> Pause
        </Button>
        <Button onClick={handleStop} disabled={!isSpeaking && !isPaused || !speechSynthesis} variant="destructive">
          <StopCircle className="mr-2 h-4 w-4" /> Stop
        </Button>
      </div>
    </div>
  );
}
