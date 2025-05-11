
"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CreditCard, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Luhn Algorithm for basic credit card number validation
function isValidLuhn(cardNumber: string): boolean {
  const sanitizedCardNumber = cardNumber.replace(/\D/g, ''); // Remove non-digits
  if (sanitizedCardNumber.length < 13 || sanitizedCardNumber.length > 19) {
    return false;
  }

  let sum = 0;
  let doubleUp = false;
  for (let i = sanitizedCardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(sanitizedCardNumber.charAt(i), 10);
    if (doubleUp) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    sum += digit;
    doubleUp = !doubleUp;
  }
  return (sum % 10) === 0;
}

export function CreditCardValidatorTool() {
  const [cardNumber, setCardNumber] = useState('');
  const [validationResult, setValidationResult] = useState<{ isValid: boolean; message: string } | null>(null);
  const { toast } = useToast();

  const handleValidateCard = () => {
    const sanitizedCardNumber = cardNumber.replace(/\s+/g, ''); // Remove all spaces
    if (!sanitizedCardNumber.trim()) {
      toast({ title: 'Input Empty', description: 'Please enter a credit card number.', variant: 'destructive' });
      setValidationResult(null);
      return;
    }

    if (!/^\d+$/.test(sanitizedCardNumber)) {
       toast({ title: 'Invalid Input', description: 'Card number should only contain digits.', variant: 'destructive' });
       setValidationResult({ isValid: false, message: 'Card number must contain only digits.' });
       return;
    }

    const isValid = isValidLuhn(sanitizedCardNumber);

    if (isValid) {
      setValidationResult({
        isValid: true,
        message: `The card number "${cardNumber}" passes the Luhn algorithm check. This indicates a syntactically valid number but does NOT confirm its authenticity or if it's active.`
      });
      toast({ title: 'Luhn Check Passed', description: 'Card number format appears valid.' });
    } else {
      setValidationResult({
        isValid: false,
        message: `The card number "${cardNumber}" failed the Luhn algorithm check. It is likely an invalid number.`
      });
      toast({ title: 'Luhn Check Failed', description: 'Card number format appears invalid.', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <Alert variant="destructive">
        <AlertTriangle className="h-5 w-5" />
        <AlertTitle className="font-semibold">Disclaimer & Security Warning</AlertTitle>
        <AlertDescription className="space-y-2">
          <p>
            This tool uses the <strong>Luhn algorithm</strong> to check if a credit card number is <strong>syntactically valid</strong> (i.e., it looks like a real card number format).
          </p>
          <ul className="list-disc list-inside pl-4 space-y-1 text-sm">
            <li>It <strong>DOES NOT</strong> verify if the credit card is real, active, has funds, or is associated with a valid account.</li>
            <li>It <strong>DOES NOT</strong> connect to any payment gateway or financial institution.</li>
            <li><strong>NEVER</strong> enter real, sensitive credit card information into untrusted online tools. This tool is for educational and testing purposes with non-sensitive, example numbers only.</li>
          </ul>
          <p className="font-medium mt-2">
            All processing is done client-side in your browser. No data is sent to any server.
          </p>
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="mr-2 h-6 w-6 text-primary" /> Credit Card Number Validator (Luhn Check)
          </CardTitle>
          <CardDescription>Enter a credit card number to check its format using the Luhn algorithm.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="cardNumberInput">Credit Card Number</Label>
            <Input
              id="cardNumberInput"
              type="text"
              value={cardNumber}
              onChange={(e) => {
                setCardNumber(e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim());
                setValidationResult(null);
              }}
              placeholder="e.g., 4992 7398 716"
              maxLength={19 + 3} // Max 19 digits + 3 spaces
              className="text-lg font-mono"
            />
          </div>
          <Button onClick={handleValidateCard} disabled={!cardNumber.trim()} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
            Validate Card Number Format
          </Button>
        </CardContent>
      </Card>

      {validationResult && (
        <Card className={`border-2 ${validationResult.isValid ? 'border-green-500' : 'border-red-500'} bg-secondary/30`}>
          <CardHeader>
            <CardTitle className={`flex items-center ${validationResult.isValid ? 'text-green-600' : 'text-red-600'}`}>
              {validationResult.isValid ? <CheckCircle2 className="mr-2 h-5 w-5" /> : <XCircle className="mr-2 h-5 w-5" />}
              Validation Result
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={validationResult.isValid ? 'text-green-700' : 'text-red-700'}>
              {validationResult.message}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
