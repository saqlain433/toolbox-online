
"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Copy, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
const numberChars = "0123456789";
const symbolChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";

export function RandomPasswordGeneratorTool() {
  const [passwordLength, setPasswordLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const { toast } = useToast();

  const generatePassword = () => {
    let charPool = "";
    if (includeUppercase) charPool += uppercaseChars;
    if (includeLowercase) charPool += lowercaseChars;
    if (includeNumbers) charPool += numberChars;
    if (includeSymbols) charPool += symbolChars;

    if (charPool === "") {
      toast({
        title: 'No character types selected',
        description: 'Please select at least one character type.',
        variant: 'destructive',
      });
      setGeneratedPassword('');
      return;
    }

    let password = "";
    for (let i = 0; i < passwordLength; i++) {
      const randomIndex = Math.floor(Math.random() * charPool.length);
      password += charPool[randomIndex];
    }
    setGeneratedPassword(password);
  };

  const handleCopy = () => {
    if (!generatedPassword) {
      toast({ title: 'Nothing to copy', description: 'Generate a password first.', variant: 'destructive' });
      return;
    }
    navigator.clipboard.writeText(generatedPassword);
    toast({ title: 'Copied to clipboard!', description: 'Password has been copied.' });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="password-length">Password Length: {passwordLength}</Label>
        <Slider
          id="password-length"
          min={6}
          max={32}
          step={1}
          value={[passwordLength]}
          onValueChange={([val]) => setPasswordLength(val)}
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox id="include-uppercase" checked={includeUppercase} onCheckedChange={(checked) => setIncludeUppercase(!!checked)} />
          <Label htmlFor="include-uppercase">Uppercase (A-Z)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="include-lowercase" checked={includeLowercase} onCheckedChange={(checked) => setIncludeLowercase(!!checked)} />
          <Label htmlFor="include-lowercase">Lowercase (a-z)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="include-numbers" checked={includeNumbers} onCheckedChange={(checked) => setIncludeNumbers(!!checked)} />
          <Label htmlFor="include-numbers">Numbers (0-9)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="include-symbols" checked={includeSymbols} onCheckedChange={(checked) => setIncludeSymbols(!!checked)} />
          <Label htmlFor="include-symbols">Symbols (!@#...)</Label>
        </div>
      </div>

      <Button onClick={generatePassword} className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
        <RefreshCw className="mr-2 h-4 w-4" /> Generate Password
      </Button>

      {generatedPassword && (
        <div>
          <Label htmlFor="generated-password">Generated Password</Label>
          <div className="flex items-center space-x-2">
            <Input
              id="generated-password"
              type="text"
              value={generatedPassword}
              readOnly
              className="text-lg font-mono bg-muted/50"
            />
            <Button variant="outline" size="icon" onClick={handleCopy} aria-label="Copy password">
              <Copy className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

