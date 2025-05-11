
"use client";

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Copy, Lock, Unlock, Wand2, AlertTriangle, KeySquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Helper to convert ArrayBuffer to Base64
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Helper to convert Base64 to ArrayBuffer
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary_string = atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}

async function getKey(password: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );
  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: enc.encode("someSaltValueHere"), // In a real app, use a unique, random salt
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
}

async function encryptText(text: string, password: string): Promise<string> {
  const key = await getKey(password);
  const iv = window.crypto.getRandomValues(new Uint8Array(12)); // 12-bytes IV for AES-GCM
  const encodedText = new TextEncoder().encode(text);

  const ciphertext = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    key,
    encodedText
  );
  // Prepend IV to ciphertext for decryption (IV_base64.Ciphertext_base64)
  return `${arrayBufferToBase64(iv)}.${arrayBufferToBase64(ciphertext)}`;
}

async function decryptText(encryptedData: string, password: string): Promise<string> {
  const key = await getKey(password);
  const parts = encryptedData.split('.');
  if (parts.length !== 2) throw new Error("Invalid encrypted data format.");
  
  const iv = base64ToArrayBuffer(parts[0]);
  const ciphertext = base64ToArrayBuffer(parts[1]);

  const decryptedBuffer = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv },
    key,
    ciphertext
  );

  return new TextDecoder().decode(decryptedBuffer);
}

export function TextEncryptorDecryptorTool() {
  const [inputText, setInputText] = useState('');
  const [password, setPassword] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isEncrypting, setIsEncrypting] = useState(true); // true for encrypt, false for decrypt
  const { toast } = useToast();
  const [processing, setProcessing] = useState(false);

  const handleProcess = async () => {
    if (!inputText.trim() || !password.trim()) {
      toast({ title: 'Missing Input', description: 'Please provide text and a password.', variant: 'destructive' });
      return;
    }
    setProcessing(true);
    setOutputText('');
    try {
      if (isEncrypting) {
        const encrypted = await encryptText(inputText, password);
        setOutputText(encrypted);
        toast({ title: 'Encryption Successful!' });
      } else {
        const decrypted = await decryptText(inputText, password);
        setOutputText(decrypted);
        toast({ title: 'Decryption Successful!' });
      }
    } catch (e: any) {
      console.error("Crypto operation failed:", e);
      setOutputText('');
      toast({ title: 'Operation Failed', description: e.message || 'Could not process text. Check password or input format.', variant: 'destructive' });
    } finally {
      setProcessing(false);
    }
  };

  const handleCopy = () => {
    if (!outputText) {
      toast({ title: 'Nothing to copy', description: 'Output is empty.', variant: 'destructive' });
      return;
    }
    navigator.clipboard.writeText(outputText);
    toast({ title: 'Copied to clipboard!' });
  };

  return (
    <div className="space-y-6">
      <Alert variant="default" className="bg-secondary/50">
        <KeySquare className="h-4 w-4" />
        <AlertTitle>AES-GCM Encryption/Decryption</AlertTitle>
        <AlertDescription>
          This tool uses AES-GCM for client-side encryption. Your password is used to derive an encryption key.
          <strong>Important:</strong> Remember your password, as it's not stored anywhere. Losing it means losing access to the encrypted data.
          The "salt" used for key derivation is fixed in this demo; for production, use a unique, random salt per encryption.
        </AlertDescription>
      </Alert>
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{isEncrypting ? 'Text to Encrypt' : 'Ciphertext to Decrypt'}</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              id="input-text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isEncrypting ? "Enter plain text here..." : "Paste encrypted Base64 string here (e.g., IV.Ciphertext)..."}
              rows={8}
              className="text-sm"
            />
          </CardContent>
        </Card>
        <Card className="bg-secondary/30">
          <CardHeader>
            <CardTitle>{isEncrypting ? 'Encrypted Output' : 'Decrypted Output'}</CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <Textarea
              id="output-text"
              value={outputText}
              readOnly
              placeholder={isEncrypting ? "Encrypted text will appear here..." : "Decrypted text will appear here..."}
              rows={8}
              className="text-sm bg-background"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              className="absolute top-3 right-3"
              aria-label="Copy output text"
              disabled={!outputText || processing}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="password">Password / Secret Key</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter a strong password"
          />
        </div>
        <div className="flex items-center space-x-2">
            <Button onClick={() => setIsEncrypting(true)} variant={isEncrypting ? "default" : "outline"} disabled={processing}>
                <Lock className="mr-2 h-4 w-4"/>Encrypt Mode
            </Button>
            <Button onClick={() => setIsEncrypting(false)} variant={!isEncrypting ? "default" : "outline"} disabled={processing}>
                <Unlock className="mr-2 h-4 w-4"/>Decrypt Mode
            </Button>
        </div>
        <Button onClick={handleProcess} disabled={processing || !password.trim() || !inputText.trim()} className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
          <Wand2 className="mr-2 h-4 w-4" /> {processing ? 'Processing...' : (isEncrypting ? 'Encrypt Text' : 'Decrypt Text')}
        </Button>
      </div>
    </div>
  );
}
