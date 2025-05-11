"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CreditCard, AlertTriangle, CheckCircle2, XCircle, Wand2 } from 'lucide-react';
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
  const [validationResult, setValidationResult] = useState<{ isValid: boolean; message: string; cardType?: string } | null>(null);
  const { toast } = useToast();

  // Basic card type detection (not exhaustive, for illustrative purposes)
  const getCardType = (cn: string): string | undefined => {
    const sanitized = cn.replace(/\D/g, '');
    if (/^4[0-9]{12}(?:[0-9]{3})?$/.test(sanitized)) return "Visa";
    if (/^5[1-5][0-9]{14}$/.test(sanitized)) return "Mastercard";
    if (/^3[47][0-9]{13}$/.test(sanitized)) return "American Express";
    if (/^6(?:011|5[0-9]{2})[0-9]{12}$/.test(sanitized)) return "Discover";
    if (/^(?:2131|1800|35\d{3})\d{11}$/.test(sanitized)) return "JCB";
    if (/^3(?:0[0-5]|[68][0-9])[0-9]{11}$/.test(sanitized)) return "Diners Club";
    return undefined;
  };

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
    
    if (sanitizedCardNumber.length < 13 || sanitizedCardNumber.length > 19) {
      toast({ title: 'Invalid Length', description: 'Card number length is typically between 13 and 19 digits.', variant: 'destructive' });
      setValidationResult({ isValid: false, message: 'Card number length is typically between 13 and 19 digits.' });
      return;
    }

    const isValid = isValidLuhn(sanitizedCardNumber);
    const cardType = getCardType(sanitizedCardNumber);

    if (isValid) {
      setValidationResult({
        isValid: true,
        message: `The card number "${cardNumber}" passes the Luhn algorithm check. ${cardType ? `Detected card type: ${cardType}.` : ''} This indicates a syntactically valid number but does NOT confirm its authenticity or if it's active.`,
        cardType
      });
      toast({ title: 'Luhn Check Passed', description: `Card number format appears valid. ${cardType ? `Type: ${cardType}` : ''}` });
    } else {
      setValidationResult({
        isValid: false,
        message: `The card number "${cardNumber}" failed the Luhn algorithm check. It is likely an invalid number.`
      });
      toast({ title: 'Luhn Check Failed', description: 'Card number format appears invalid.', variant: 'destructive' });
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Format input with spaces every 4 digits, allow only digits
    const rawValue = e.target.value.replace(/\D/g, ''); // Remove non-digits
    const formattedValue = rawValue.replace(/(.{4})/g, '$1 ').trim();
    setCardNumber(formattedValue.slice(0, 23)); // Max 19 digits + 4 spaces
    setValidationResult(null);
  };

  return (
    <div className="space-y-6">
      <Alert variant="destructive">
        <AlertTriangle className="h-5 w-5" />
        <AlertTitle className="font-semibold">Disclaimer & Security Warning</AlertTitle>
        <AlertDescription className="space-y-2">
          <p>
            This tool uses the <strong>Luhn algorithm</strong> to check if a credit card number is <strong>syntactically valid</strong> (i.e., it looks like a real card number format). It may also attempt to identify the card type based on its prefix.
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
              onChange={handleInputChange}
              placeholder="e.g., 4992 7398 7160 2345"
              maxLength={23} // Max 19 digits + 4 spaces
              className="text-lg font-mono"
            />
          </div>
          <Button onClick={handleValidateCard} disabled={!cardNumber.replace(/\s+/g, '').trim()} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
            <Wand2 className="mr-2 h-4 w-4" /> Validate Card Number Format
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
            <p className={`mb-2 ${validationResult.isValid ? 'text-green-700' : 'text-red-700'}`}>
              {validationResult.message}
            </p>
            {validationResult.cardType && validationResult.isValid && (
              <p className="text-sm text-muted-foreground">
                Detected Card Type: <strong>{validationResult.cardType}</strong>
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}