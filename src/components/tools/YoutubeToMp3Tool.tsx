
"use client";

import { Youtube, ServerCrash, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const YoutubeMediaToolPlaceholder = ({ name, mediaType }: { name: string, mediaType: string }) => (
  <div className="p-6 border rounded-lg bg-card shadow-sm text-center space-y-6">
    <div className="flex flex-col items-center justify-center">
      <Youtube className="h-16 w-16 text-red-500 mb-4" />
      <h2 className="text-2xl font-semibold mb-2 text-foreground">{name}</h2>
      <p className="text-muted-foreground mb-4">Convert YouTube videos to {mediaType} format.</p>
    </div>

    <Alert variant="default" className="text-left bg-secondary/50">
      <Info className="h-5 w-5 text-primary" />
      <AlertTitle className="font-semibold text-primary">Important Notice</AlertTitle>
      <AlertDescription className="space-y-2 text-muted-foreground">
        <p>
          Tools that download or convert content from platforms like YouTube face significant technical and policy challenges when implemented purely on the client-side (in your browser).
        </p>
        <ul className="list-disc list-inside pl-4 space-y-1 text-sm">
          <li><strong>Terms of Service:</strong> Directly accessing YouTube content for conversion may violate their Terms of Service.</li>
          <li><strong>API Limitations:</strong> Official APIs may not support direct downloads or conversions, and unofficial methods are unreliable and can break.</li>
          <li><strong>Server-Side Processing:</strong> Reliable conversion and downloading typically require robust server-side infrastructure to handle requests, process media files, and manage API interactions securely and efficiently.</li>
        </ul>
        <p className="font-medium text-foreground/90 mt-2">
          We are actively exploring solutions to offer this functionality in a compliant and reliable manner. Building a robust server-side component for this is a significant undertaking.
        </p>
        <p>Thank you for your patience and understanding!</p>
      </AlertDescription>
    </Alert>

    <div className="flex flex-col items-center justify-center mt-6 p-4 border-t border-border">
        <ServerCrash className="h-12 w-12 text-muted-foreground mb-3"/>
        <p className="text-sm text-muted-foreground">This tool is currently under advanced development to integrate necessary server-side capabilities.</p>
    </div>
  </div>
);

export function YoutubeToMp3Tool() {
  return <YoutubeMediaToolPlaceholder name="YouTube to MP3 Converter" mediaType="MP3 audio" />;
}
