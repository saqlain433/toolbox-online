
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Globe, Wifi, Loader2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface IpInfo {
  ip: string;
}

export function IpAddressCheckerTool() {
  const [ipAddress, setIpAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchIpAddress = async () => {
    setIsLoading(true);
    setError(null);
    setIpAddress(null);
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      if (!response.ok) {
        throw new Error(`Failed to fetch IP: ${response.statusText}`);
      }
      const data: IpInfo = await response.json();
      setIpAddress(data.ip);
      toast({ title: 'IP Address Fetched', description: `Your public IP is ${data.ip}.` });
    } catch (err: any) {
      console.error("Error fetching IP address:", err);
      setError(err.message || 'Could not fetch IP address. Please try again.');
      toast({ title: 'Error Fetching IP', description: err.message || 'Could not fetch IP address.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Automatically fetch IP when the component mounts
    fetchIpAddress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCopyIp = () => {
    if (ipAddress) {
      navigator.clipboard.writeText(ipAddress);
      toast({ title: 'Copied to clipboard!', description: 'IP Address has been copied.' });
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        View your current public IP address. This tool fetches your IP from an external service.
      </p>
      
      <Button onClick={fetchIpAddress} disabled={isLoading} className="bg-accent hover:bg-accent/90 text-accent-foreground">
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Wifi className="mr-2 h-4 w-4" />
        )}
        {isLoading ? 'Fetching IP...' : (ipAddress ? 'Refresh My IP' : 'Get My IP Address')}
      </Button>

      {error && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center text-destructive">
              <AlertTriangle className="mr-2 h-5 w-5" /> Error Fetching IP
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      )}

      {ipAddress && !error && (
        <Card className="bg-secondary/30">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="mr-2 h-6 w-6 text-primary" /> Your Public IP Address
            </CardTitle>
            <CardDescription>This is the public IP address your internet traffic is originating from.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-3xl md:text-4xl font-bold font-mono text-primary p-4 bg-background rounded-md text-center break-all">
              {ipAddress}
            </p>
            <Button onClick={handleCopyIp} variant="outline" className="w-full">
              Copy IP Address
            </Button>
          </CardContent>
        </Card>
      )}

      {!isLoading && !ipAddress && !error && (
         <Card className="border-dashed border-border">
          <CardContent className="p-6 text-center text-muted-foreground">
            Click the button above to fetch your IP address.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
