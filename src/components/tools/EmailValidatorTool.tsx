"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MailCheck, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Basic regex for email format validation (RFC 5322 general compliance)
// This regex is for basic client-side format checking, not exhaustive.
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;


export function EmailValidatorTool() {
  const [email, setEmail] = useState('');
  const [validationResult, setValidationResult] = useState<{ isValid: boolean; message: string } | null>(null);
  const { toast } = useToast();

  const handleValidateEmail = () => {
    if (!email.trim()) {
      toast({ title: 'Input Empty', description: 'Please enter an email address to validate.', variant: 'destructive' });
      setValidationResult(null);
      return;
    }

    const isValidFormat = EMAIL_REGEX.test(email.trim());

    if (isValidFormat) {
      setValidationResult({
        isValid: true,
        message: `The email address "${email.trim()}" appears to have a valid format. For actual deliverability, server-side checks (e.g., SMTP verification) would be necessary.`
      });
      toast({ title: 'Format Valid', description: 'Email format appears correct.' });
    } else {
      setValidationResult({
        isValid: false,
        message: `The email address "${email.trim()}" does not seem to have a valid format. Please check for typos or missing parts like "@" or a domain extension.`
      });
      toast({ title: 'Invalid Format', description: 'Email format appears incorrect.', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <Alert variant="default" className="bg-secondary/50">
        <AlertTriangle className="h-5 w-5 text-primary" />
        <AlertTitle className="font-semibold text-primary">Important Note on Email Validation</AlertTitle>
        <AlertDescription className="space-y-2 text-muted-foreground">
          <p>
            This tool performs a <strong>client-side format check</strong> (syntax check) of the email address.
          </p>
          <ul className="list-disc list-inside pl-4 space-y-1 text-sm">
            <li>It can tell you if the email address structure looks correct (e.g., has an "@" symbol, a domain).</li>
            <li>It <strong>cannot</strong> verify if the email address actually exists, if the domain is real, or if the mailbox can receive emails.</li>
          </ul>
          <p className="font-medium text-foreground/90 mt-2">
            True email validation (checking for existence and deliverability) requires server-side verification processes like SMTP checks or using specialized third-party APIs.
          </p>
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MailCheck className="mr-2 h-6 w-6 text-primary" /> Email Format Validator
          </CardTitle>
          <CardDescription>Enter an email address to check its format.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="emailInput">Email Address</Label>
            <Input
              id="emailInput"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setValidationResult(null);
              }}
              placeholder="e.g., user@example.com"
              className="text-lg"
            />
          </div>
          <Button onClick={handleValidateEmail} disabled={!email.trim()} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
            Validate Email Format
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