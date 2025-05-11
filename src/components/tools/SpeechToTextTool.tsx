
"use client";

import { useState, useEffect, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mic, StopCircle, Copy, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

export function SpeechToTextTool() {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [selectedLang, setSelectedLang] = useState('en-US');
  const [availableLangs, setAvailableLangs] = useState<{ code: string, name: string }[]>([]);
  const { toast } = useToast();
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [isBrowserSupported, setIsBrowserSupported] = useState(true);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsBrowserSupported(false);
      toast({
        title: "Browser Not Supported",
        description: "Your browser does not support the Web Speech API. Try Chrome or Edge.",
        variant: "destructive",
      });
      return;
    }
    setIsBrowserSupported(true);

    // Populate language list (this is a simplified list, a full list would be extensive)
    // Common languages, real list might depend on browser/OS
    const commonLangs = [
      { code: 'en-US', name: 'English (US)' },
      { code: 'en-GB', name: 'English (UK)' },
      { code: 'es-ES', name: 'Español (España)' },
      { code: 'fr-FR', name: 'Français (France)' },
      { code: 'de-DE', name: 'Deutsch (Deutschland)' },
      { code: 'ja-JP', name: '日本語 (日本)' },
      { code: 'zh-CN', name: '中文 (中国大陆)' },
    ];
    setAvailableLangs(commonLangs);


    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = selectedLang;

    recognitionInstance.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setTranscript(prev => prev + finalTranscript + interimTranscript);
    };

    recognitionInstance.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      let errorMessage = "An error occurred during speech recognition.";
      if (event.error === 'no-speech') {
        errorMessage = "No speech was detected. Please try again.";
      } else if (event.error === 'audio-capture') {
        errorMessage = "Audio capture failed. Ensure microphone is connected and permissions are granted.";
      } else if (event.error === 'not-allowed') {
        errorMessage = "Microphone access denied. Please enable microphone permissions in your browser settings.";
      }
      toast({
        title: "Recognition Error",
        description: errorMessage,
        variant: "destructive",
      });
      setIsListening(false);
    };
    
    recognitionInstance.onend = () => {
      if (isListening) { // If it ended unexpectedly while supposed to be listening
        // No automatic restart for this version to keep it simpler
        // recognitionInstance.start();
      }
    };

    recognitionRef.current = recognitionInstance;

    return () => {
      recognitionRef.current?.stop();
    };
  }, [selectedLang, toast, isListening]);

  const handleToggleListen = async () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      // Request microphone permission
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setTranscript(''); // Clear previous transcript
        recognitionRef.current.lang = selectedLang;
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
         console.error("Error accessing microphone", err);
         toast({
            title: "Microphone Access Denied",
            description: "Please enable microphone permissions in your browser settings.",
            variant: "destructive",
        });
      }
    }
  };

  const handleCopy = () => {
    if (!transcript) {
      toast({ title: 'Nothing to copy', description: 'Transcript is empty.', variant: 'destructive' });
      return;
    }
    navigator.clipboard.writeText(transcript);
    toast({ title: 'Copied to clipboard!', description: 'Transcript has been copied.' });
  };

  const handleClear = () => {
    setTranscript('');
  };

  if (!isBrowserSupported) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Browser Not Supported</AlertTitle>
        <AlertDescription>
          Your browser does not support the Web Speech API. Please try using a modern browser like Chrome or Edge.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
       <p className="text-muted-foreground">
        Click "Start Listening" and speak into your microphone. The transcribed text will appear below.
      </p>
      <div className="grid md:grid-cols-3 gap-4">
        <Button onClick={handleToggleListen} className="md:col-span-1 bg-accent hover:bg-accent/90 text-accent-foreground" disabled={!isBrowserSupported}>
          {isListening ? <StopCircle className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
          {isListening ? 'Stop Listening' : 'Start Listening'}
        </Button>
        <div className="md:col-span-2">
          <Label htmlFor="language-select">Language</Label>
          <Select value={selectedLang} onValueChange={setSelectedLang} disabled={isListening || availableLangs.length === 0}>
            <SelectTrigger id="language-select">
              <SelectValue placeholder="Select language..." />
            </SelectTrigger>
            <SelectContent>
              {availableLangs.map(lang => (
                <SelectItem key={lang.code} value={lang.code}>{lang.name}</SelectItem>
              ))}
               {availableLangs.length === 0 && <SelectItem value="loading" disabled>Loading languages...</SelectItem>}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Transcript</CardTitle>
          <CardDescription>The recognized speech will appear here. Interim results are shown while you speak.</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={transcript}
            readOnly={!isListening} // Allow editing if needed, though typically read-only
            onChange={(e) => !isListening && setTranscript(e.target.value)}
            placeholder={isListening ? "Listening..." : "Your transcribed text will appear here..."}
            rows={10}
            className="text-base bg-muted/30"
          />
        </CardContent>
        <CardContent className="flex gap-2">
            <Button variant="outline" onClick={handleCopy} disabled={!transcript}>
                <Copy className="mr-2 h-4 w-4" /> Copy
            </Button>
            <Button variant="outline" onClick={handleClear} disabled={!transcript}>
                <Trash2 className="mr-2 h-4 w-4" /> Clear
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
