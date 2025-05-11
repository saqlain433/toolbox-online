
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarIcon } from 'lucide-react';
import { format, differenceInYears, differenceInMonths, differenceInDays, addYears, addMonths, isValid } from 'date-fns';
import { cn } from '@/lib/utils';

interface AgeResult {
  years: number;
  months: number;
  days: number;
}

export function AgeCalculatorTool() {
  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);
  const [age, setAge] = useState<AgeResult | null>(null);
  const [targetDate, setTargetDate] = useState<Date | undefined>(new Date());


  const calculateAge = () => {
    if (!birthDate || !targetDate || !isValid(birthDate) || !isValid(targetDate)) {
      setAge(null);
      return;
    }

    if (birthDate > targetDate) {
      setAge(null); // Or show an error: birth date cannot be in the future
      alert("Birth date cannot be after the target date.");
      return;
    }
    
    let years = differenceInYears(targetDate, birthDate);
    const pastBirthdayThisYear = addYears(birthDate, years);
    
    let months = differenceInMonths(targetDate, pastBirthdayThisYear);
    const pastMonthDayThisYear = addMonths(pastBirthdayThisYear, months);
    
    let days = differenceInDays(targetDate, pastMonthDayThisYear);

    // Adjust if targetDate is before birth month/day in the year
    if (days < 0) {
        months--;
        const previousMonth = addMonths(pastBirthdayThisYear, months);
        days = differenceInDays(targetDate, previousMonth);
    }
    if (months < 0) {
        years--;
        months += 12;
    }

    setAge({ years, months, days });
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Select your date of birth and a target date (defaults to today) to calculate your age.
      </p>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="birth-date">Date of Birth</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="birth-date"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !birthDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {birthDate ? format(birthDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={birthDate}
                  onSelect={setBirthDate}
                  initialFocus
                  captionLayout="dropdown-buttons"
                  fromYear={1900}
                  toYear={new Date().getFullYear()}
                />
              </PopoverContent>
            </Popover>
          </div>
           <div>
            <Label htmlFor="target-date">Age at Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="target-date"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !targetDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {targetDate ? format(targetDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={targetDate}
                  onSelect={setTargetDate}
                  initialFocus
                  captionLayout="dropdown-buttons"
                  fromYear={1900}
                  toYear={new Date().getFullYear() + 100} 
                />
              </PopoverContent>
            </Popover>
          </div>
          <Button onClick={calculateAge} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
            Calculate Age
          </Button>
        </div>

        {age && (
          <Card className="bg-secondary/30">
            <CardContent className="p-6 text-center space-y-4">
              <h3 className="text-xl font-semibold text-foreground">Your Age</h3>
              <div className="grid grid-cols-3 gap-2">
                 <div className="p-3 bg-background rounded-lg shadow">
                    <p className="text-3xl font-bold text-primary">{age.years}</p>
                    <p className="text-sm text-muted-foreground">Years</p>
                 </div>
                 <div className="p-3 bg-background rounded-lg shadow">
                    <p className="text-3xl font-bold text-primary">{age.months}</p>
                    <p className="text-sm text-muted-foreground">Months</p>
                 </div>
                 <div className="p-3 bg-background rounded-lg shadow">
                    <p className="text-3xl font-bold text-primary">{age.days}</p>
                    <p className="text-sm text-muted-foreground">Days</p>
                 </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Calculated as of {targetDate ? format(targetDate, "PPP") : 'N/A'}.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
