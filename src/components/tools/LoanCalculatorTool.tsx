
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Calculator, Wallet, Landmark, PercentIcon, CalendarClockIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const loanSchema = z.object({
  loanAmount: z.preprocess(
    (val) => parseFloat(String(val)),
    z.number().positive({ message: "Loan amount must be positive." })
  ),
  interestRate: z.preprocess(
    (val) => parseFloat(String(val)),
    z.number().positive({ message: "Interest rate must be positive." }).max(100, { message: "Interest rate seems too high." })
  ),
  loanTerm: z.preprocess(
    (val) => parseInt(String(val), 10),
    z.number().int().positive({ message: "Loan term must be a positive number of years." }).max(50, { message: "Loan term seems too long."})
  ),
});

type LoanFormValues = z.infer<typeof loanSchema>;

interface LoanCalculationResult {
  monthlyPayment: number;
  totalPrincipal: number;
  totalInterest: number;
  totalPayment: number;
}

export function LoanCalculatorTool() {
  const [result, setResult] = useState<LoanCalculationResult | null>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoanFormValues>({
    resolver: zodResolver(loanSchema),
    defaultValues: {
      loanAmount: 10000,
      interestRate: 5,
      loanTerm: 5,
    }
  });

  const onSubmit: SubmitHandler<LoanFormValues> = async (data) => {
    try {
      const principal = data.loanAmount;
      const annualInterestRate = data.interestRate / 100;
      const loanTermInYears = data.loanTerm;

      const monthlyInterestRate = annualInterestRate / 12;
      const numberOfPayments = loanTermInYears * 12;

      if (monthlyInterestRate === 0) { // Handle 0% interest rate
        const monthlyPayment = principal / numberOfPayments;
        setResult({
          monthlyPayment,
          totalPrincipal: principal,
          totalInterest: 0,
          totalPayment: principal,
        });
      } else {
        const monthlyPayment =
          principal *
          (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
          (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

        const totalPayment = monthlyPayment * numberOfPayments;
        const totalInterest = totalPayment - principal;

        setResult({
          monthlyPayment,
          totalPrincipal: principal,
          totalInterest,
          totalPayment,
        });
      }
      toast({ title: "Calculation Successful", description: "Loan details calculated." });
    } catch (e) {
      console.error(e);
      toast({ title: "Calculation Error", description: "Could not calculate loan details.", variant: "destructive" });
      setResult(null);
    }
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Enter your loan amount, annual interest rate, and loan term in years to calculate your monthly payments and total interest.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Loan Details</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="loanAmount">Loan Amount ($)</Label>
              <div className="relative">
                <Wallet className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="loanAmount"
                  type="number"
                  step="any"
                  {...register('loanAmount')}
                  placeholder="e.g., 10000"
                  className={`pl-10 ${errors.loanAmount ? 'border-destructive' : ''}`}
                />
              </div>
              {errors.loanAmount && <p className="text-sm text-destructive mt-1">{errors.loanAmount.message}</p>}
            </div>
            <div>
              <Label htmlFor="interestRate">Annual Interest Rate (%)</Label>
              <div className="relative">
                <PercentIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="interestRate"
                  type="number"
                  step="any"
                  {...register('interestRate')}
                  placeholder="e.g., 5"
                  className={`pl-10 ${errors.interestRate ? 'border-destructive' : ''}`}
                />
              </div>
              {errors.interestRate && <p className="text-sm text-destructive mt-1">{errors.interestRate.message}</p>}
            </div>
            <div>
              <Label htmlFor="loanTerm">Loan Term (Years)</Label>
              <div className="relative">
                <CalendarClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="loanTerm"
                  type="number"
                  step="1"
                  {...register('loanTerm')}
                  placeholder="e.g., 5"
                  className={`pl-10 ${errors.loanTerm ? 'border-destructive' : ''}`}
                />
              </div>
              {errors.loanTerm && <p className="text-sm text-destructive mt-1">{errors.loanTerm.message}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex justify-start gap-2">
            <Button type="submit" disabled={isSubmitting} className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Calculator className="mr-2 h-4 w-4" /> {isSubmitting ? 'Calculating...' : 'Calculate'}
            </Button>
            <Button type="button" variant="outline" onClick={() => { reset(); setResult(null); }} disabled={isSubmitting}>
              Clear
            </Button>
          </CardFooter>
        </Card>
      </form>

      {result && (
        <Card className="bg-secondary/30">
          <CardHeader>
            <CardTitle>Loan Summary</CardTitle>
            <CardDescription>Here is a breakdown of your loan.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-background rounded-lg shadow">
                <Label className="text-sm text-muted-foreground">Monthly Payment</Label>
                <p className="text-2xl font-semibold text-primary">{formatCurrency(result.monthlyPayment)}</p>
              </div>
              <div className="p-4 bg-background rounded-lg shadow">
                <Label className="text-sm text-muted-foreground">Total Principal Paid</Label>
                <p className="text-2xl font-semibold text-primary">{formatCurrency(result.totalPrincipal)}</p>
              </div>
              <div className="p-4 bg-background rounded-lg shadow">
                <Label className="text-sm text-muted-foreground">Total Interest Paid</Label>
                <p className="text-2xl font-semibold text-primary">{formatCurrency(result.totalInterest)}</p>
              </div>
              <div className="p-4 bg-background rounded-lg shadow">
                <Label className="text-sm text-muted-foreground">Total Amount Paid</Label>
                <p className="text-2xl font-semibold text-primary">{formatCurrency(result.totalPayment)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
