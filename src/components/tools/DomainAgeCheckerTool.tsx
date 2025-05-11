
"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Globe, CalendarSearch, AlertTriangle, ServerCrash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function DomainAgeCheckerTool() {
  const [domainName, setDomainName] = useState('');
  // const [domainAgeInfo, setDomainAgeInfo] = useState<string | null>(null); // Placeholder for future if implemented
  const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState<string | null>(null); // Placeholder for future
  const { toast } = useToast();

  const handleCheckDomainAge = async () => {
    if (!domainName.trim()) {
      toast({ title: 'Input Empty', description: 'Please enter a domain name.', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    // Simulate API call or indicate non-functionality
    setTimeout(() => {
      toast({ 
        title: 'Feature Under Development', 
        description: 'Reliable domain age checking requires server-side capabilities which are being developed for this tool.',
        variant: 'default'
      });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <Alert variant="default" className="bg-secondary/50">
        <ServerCrash className="h-5 w-5 text-primary" />
        <AlertTitle className="font-semibold text-primary">Important Note on this Tool</AlertTitle>
        <AlertDescription className="space-y-2 text-muted-foreground">
          <p>
            Reliably checking domain age (WHOIS data) directly from a web browser (client-side) is very challenging due to:
          </p>
          <ul className="list-disc list-inside pl-4 space-y-1 text-sm">
            <li><strong>Security Restrictions:</strong> Browsers limit direct network requests to WHOIS servers (CORS, mixed content).</li>
            <li><strong>Rate Limiting:</strong> WHOIS servers often rate-limit requests to prevent abuse.</li>
            <li><strong>Inconsistent Data:</strong> WHOIS data formats vary, making parsing complex.</li>
            <li><strong>Privacy Services:</strong> Many domains use privacy services that obscure registration dates.</li>
          </ul>
          <p className="font-medium text-foreground/90 mt-2">
            A robust Domain Age Checker typically requires a server-side component to handle WHOIS lookups or integration with a specialized third-party API.
            This client-side version is for demonstration and is currently <strong>not fully functional</strong> for fetching live domain age.
          </p>
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CalendarSearch className="mr-2 h-6 w-6 text-primary" /> Domain Age Checker
          </CardTitle>
          <CardDescription>Enter a domain name to (conceptually) check its age.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="domainName">Domain Name</Label>
            <Input
              id="domainName"
              type="text"
              value={domainName}
              onChange={(e) => setDomainName(e.target.value)}
              placeholder="e.g., example.com"
              className="text-lg"
            />
          </div>
          <Button onClick={handleCheckDomainAge} disabled={isLoading || !domainName.trim()} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
            {isLoading ? 'Checking...' : 'Check Domain Age (Simulated)'}
          </Button>
        </CardContent>
      </Card>

      {/* Placeholder for results if the tool were fully functional */}
      {/* {domainAgeInfo && (
        <Card className="bg-secondary/30">
          <CardHeader><CardTitle>Domain Information</CardTitle></CardHeader>
          <CardContent><p>{domainAgeInfo}</p></CardContent>
        </Card>
      )}
      {error && (
        <Card className="border-destructive">
          <CardHeader><CardTitle className="text-destructive">Error</CardTitle></CardHeader>
          <CardContent><p className="text-destructive-foreground">{error}</p></CardContent>
        </Card>
      )} */}
       <Card className="border-dashed border-border">
          <CardContent className="p-6 text-center text-muted-foreground">
            <Globe className="h-10 w-10 mx-auto mb-2 text-muted-foreground/50" />
            Live domain age results will be displayed here once server-side integration is complete. 
            Currently, this tool demonstrates the UI and concept.
          </CardContent>
        </Card>
    </div>
  );
}
