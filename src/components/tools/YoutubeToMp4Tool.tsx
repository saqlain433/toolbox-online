
"use client";

import { Youtube } from 'lucide-react';

const SpecificPlaceholderTool = ({ name, specificMessage }: { name: string, specificMessage: string }) => (
  <div className="p-6 border rounded-lg bg-card shadow-sm text-center">
    <div className="flex flex-col items-center justify-center">
      <Youtube className="h-16 w-16 text-muted-foreground mb-4" />
      <h2 className="text-xl font-semibold mb-2 text-foreground">{name}</h2>
      <p className="text-muted-foreground mb-3">{specificMessage}</p>
      <div className="max-w-md mx-auto text-sm text-muted-foreground space-y-2">
        <p>
          Tools that interact directly with third-party services like YouTube for downloading or converting content often require server-side infrastructure to handle requests, process data, and manage potential API restrictions or terms of service compliance.
        </p>
        <p>
          Implementing such features robustly and reliably solely on the client-side (in the browser) can be challenging due to technical limitations and policy considerations.
        </p>
        <p className="font-medium text-foreground/80 mt-3">
          We are exploring the best ways to offer this functionality. Thank you for your understanding!
        </p>
      </div>
    </div>
  </div>
);

export function YoutubeToMp4Tool() {
  return <SpecificPlaceholderTool name="YouTube to MP4 Converter" specificMessage="Download YouTube videos in MP4 format." />;
}
