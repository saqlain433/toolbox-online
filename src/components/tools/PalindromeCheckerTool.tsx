
"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle, SpellCheck } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

export function PalindromeCheckerTool() {
  const [inputText, setInputText] = useState('');
  const [isPalindrome, setIsPalindrome] = useState<boolean | null>(null);
  const [ignoreCase, setIgnoreCase] = useState(true);
  const [ignoreSpacesAndPunctuation, setIgnoreSpacesAndPunctuation] = useState(true);

  const checkPalindrome = () => {
    if (!inputText.trim()) {
      setIsPalindrome(null);
      return;
    }

    let processedText = inputText;
    if (ignoreCase) {
      processedText = processedText.toLowerCase();
    }
    if (ignoreSpacesAndPunctuation) {
      processedText = processedText.replace(/[\s~`!@#$%^&*(){}\[\];:"'<,.>?\/\\|_+=-]/g, '');
    }
    
    if (!processedText) { // If after processing, text is empty (e.g. input was only spaces/punctuation)
      setIsPalindrome(false); // Or null, depending on desired behavior
      return;
    }

    const reversedText = processedText.split('').reverse().join('');
    setIsPalindrome(processedText === reversedText);
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Enter a word, phrase, or number to check if it reads the same forwards and backward.
      </p>
      <div>
        <Label htmlFor="palindrome-input">Text or Number</Label>
        <Input
          id="palindrome-input"
          type="text"
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
            setIsPalindrome(null); // Reset result on input change
          }}
          placeholder="e.g., madam, racecar, 121"
          className="text-lg"
        />
      </div>

       <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Switch
            id="ignore-case"
            checked={ignoreCase}
            onCheckedChange={setIgnoreCase}
          />
          <Label htmlFor="ignore-case">Ignore Case (A vs a)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="ignore-spaces"
            checked={ignoreSpacesAndPunctuation}
            onCheckedChange={setIgnoreSpacesAndPunctuation}
          />
          <Label htmlFor="ignore-spaces">Ignore Spaces & Punctuation</Label>
        </div>
      </div>

      <Button onClick={checkPalindrome} className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
        <SpellCheck className="mr-2 h-4 w-4" /> Check Palindrome
      </Button>

      {isPalindrome !== null && (
        <Card className={`bg-secondary/30 ${isPalindrome ? 'border-green-500' : 'border-red-500'}`}>
          <CardHeader className="flex flex-row items-center space-x-3">
            {isPalindrome ? (
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            ) : (
              <XCircle className="h-8 w-8 text-red-500" />
            )}
            <CardTitle className={isPalindrome ? 'text-green-600' : 'text-red-600'}>
              {isPalindrome ? 'It is a Palindrome!' : 'Not a Palindrome.'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              The entered text "{inputText}" is {isPalindrome ? '' : 'not '}a palindrome
              {ignoreCase || ignoreSpacesAndPunctuation ? ' when ' : ''}
              {ignoreCase ? 'ignoring case' : ''}
              {ignoreCase && ignoreSpacesAndPunctuation ? ' and ' : ''}
              {ignoreSpacesAndPunctuation ? 'ignoring spaces/punctuation' : ''}.
            </CardDescription>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
