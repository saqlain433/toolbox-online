
"use client";

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Copy, Wand2, Hash, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

async function generateSha256Hash(text: string): Promise<string> {
  if (!text) return '';
  if (typeof window.crypto === 'undefined' || typeof window.crypto.subtle === 'undefined') {
    throw new Error("Web Crypto API is not supported in this browser or context (e.g. HTTP).");
  }
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export function Sha256HashGeneratorTool() {
  const [inputText, setInputText] = useState('');
  const [hashOutput, setHashOutput] = useState('');
  const { toast } = useToast();
  const [processing, setProcessing] = useState(false);

  const handleGenerateHash = async () => {
    if (!inputText.trim()) {
      toast({ title: 'Input is empty', description: 'Please enter some text to hash.', variant: 'default' });
      setHashOutput('');
      return;
    }
    setProcessing(true);
    try {
      const hash = await generateSha256Hash(inputText);
      setHashOutput(hash);
      toast({ title: 'SHA-256 Hash Generated!', description: 'Your text has been successfully hashed.' });
    } catch (e: any) {
      setHashOutput('');
      toast({ title: 'Hashing Error', description: e.message, variant: 'destructive' });
      console.error("SHA-256 Hashing error:", e);
    } finally {
      setProcessing(false);
    }
  };

  const handleCopy = () => {
    if (!hashOutput) {
      toast({ title: 'Nothing to copy', description: 'Output is empty.', variant: 'destructive' });
      return;
    }
    navigator.clipboard.writeText(hashOutput);
    toast({ title: 'Copied to clipboard!', description: 'SHA-256 hash has been copied.' });
  };

  return (
    <div className="space-y-6">
      <Alert variant="default" className="bg-secondary/50">
        <ShieldCheck className="h-4 w-4" />
        <AlertTitle>SHA-256 Hashing</AlertTitle>
        <AlertDescription>
          SHA-256 is a secure cryptographic hash function. This tool uses the browser's native Web Crypto API for hashing.
          The generated hash is a fixed-size string representing your input data. It's commonly used for data integrity checks and digital signatures.
          Ensure your browser supports Web Crypto API (most modern browsers do, requires HTTPS or localhost).
        </AlertDescription>
      </Alert>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Hash className="mr-2 h-6 w-6 text-primary"/>SHA-256 Hash Generator</CardTitle>
          <CardDescription>Enter text to generate its SHA-256 hash.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="input-text-sha256">Input Text</Label>
            <Textarea
              id="input-text-sha256"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type or paste your text here..."
              rows={6}
              className="text-base"
            />
          </div>
          <Button onClick={handleGenerateHash} disabled={processing} className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
            <Wand2 className="mr-2 h-4 w-4" /> {processing ? 'Generating...' : 'Generate SHA-256 Hash'}
          </Button>
        </CardContent>
      </Card>

      {hashOutput && (
        <Card className="bg-secondary/30">
          <CardHeader>
            <CardTitle>Generated SHA-256 Hash</CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <Input
              id="output-hash-sha256"
              value={hashOutput}
              readOnly
              className="text-sm font-mono bg-background pr-10 break-all" // break-all for long hashes
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              className="absolute top-1/2 right-2 transform -translate-y-1/2"
              aria-label="Copy hash"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
