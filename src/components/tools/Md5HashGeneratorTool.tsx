
"use client";

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Copy, Wand2, Hash, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

async function generateHash(text: string, algorithm: 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512'): Promise<string> {
  if (!text) return '';
  if (typeof window.crypto === 'undefined' || typeof window.crypto.subtle === 'undefined') {
    throw new Error("Web Crypto API is not supported in this browser or context (e.g. HTTP).");
  }
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await window.crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export function Md5HashGeneratorTool() {
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
      // Using SHA-1 as a stand-in because MD5 is not available in Web Crypto API
      const hash = await generateHash(inputText, 'SHA-1');
      setHashOutput(hash);
      toast({ title: 'Hash Generated (SHA-1)', description: 'SHA-1 hash generated as MD5 is not directly available/secure.' });
    } catch (e: any) {
      setHashOutput('');
      toast({ title: 'Hashing Error', description: e.message, variant: 'destructive' });
      console.error("Hashing error:", e);
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
    toast({ title: 'Copied to clipboard!', description: 'Hash has been copied.' });
  };

  return (
    <div className="space-y-6">
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Important Note on MD5</AlertTitle>
        <AlertDescription>
          MD5 is considered cryptographically broken and unsuitable for further use. Modern web browsers do not provide a native MD5 implementation via the Web Crypto API due to security concerns.
          This tool demonstrates hashing using <strong>SHA-1</strong> instead. While SHA-1 is also deprecated for many security uses, it's available in browsers.
          For secure hashing, please use SHA-256 or stronger algorithms. This tool is for educational or non-security-critical checksum purposes only when MD5-like behavior (fixed-length hash) is needed for legacy systems.
        </AlertDescription>
      </Alert>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Hash className="mr-2 h-6 w-6 text-primary"/>MD5-like Hash Generator (using SHA-1)</CardTitle>
          <CardDescription>Enter text to generate a SHA-1 hash (as a proxy for MD5).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="input-text">Input Text</Label>
            <Textarea
              id="input-text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type or paste your text here..."
              rows={6}
              className="text-base"
            />
          </div>
          <Button onClick={handleGenerateHash} disabled={processing} className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
            <Wand2 className="mr-2 h-4 w-4" /> {processing ? 'Generating...' : 'Generate SHA-1 Hash'}
          </Button>
        </CardContent>
      </Card>

      {hashOutput && (
        <Card className="bg-secondary/30">
          <CardHeader>
            <CardTitle>Generated SHA-1 Hash</CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <Input
              id="output-hash"
              value={hashOutput}
              readOnly
              className="text-base font-mono bg-background pr-10" 
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
