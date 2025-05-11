
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ImageIcon, AlertTriangle, Download, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function Base64ToImageTool() {
  const [base64Input, setBase64Input] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [fileName, setFileName] = useState<string>("downloaded_image");

  const isValidDataUri = (s: string): boolean => {
    return /^data:image\/(?:gif|png|jpeg|bmp|webp|svg\+xml)(?:;charset=utf-8)?;base64,(?:[A-Za-z0-9]|[+/])+={0,2}/.test(s);
  }
  
  const getMimeTypeFromDataUri = (dataUri: string): string | null => {
    const match = dataUri.match(/^data:(image\/(?:gif|png|jpeg|bmp|webp|svg\+xml));base64,/);
    return match ? match[1] : null;
  }

  const handleConvert = () => {
    setError(null);
    setImagePreview(null);

    if (!base64Input.trim()) {
      setError('Please paste a Base64 Data URI string.');
      toast({ title: 'Input Empty', description: 'Base64 input cannot be empty.', variant: 'destructive' });
      return;
    }
    
    let dataUri = base64Input.trim();
    // Attempt to prepend data URI scheme if it looks like raw base64
    if (!dataUri.startsWith('data:image/')) {
        // Try to guess common types or default to png
        dataUri = `data:image/png;base64,${dataUri}`; 
        toast({title: "Assuming PNG", description: "Input didn't look like a full Data URI. Assuming PNG format.", variant: "default"});
    }


    if (!isValidDataUri(dataUri)) {
      setError('Invalid Base64 Data URI format. It should start with "data:image/(type);base64,...".');
      toast({ title: 'Invalid Format', description: 'The input string is not a valid image Data URI.', variant: 'destructive' });
      return;
    }

    setImagePreview(dataUri);
    
    const mimeType = getMimeTypeFromDataUri(dataUri);
    const extension = mimeType ? mimeType.split('/')[1].replace('svg+xml', 'svg') : 'png';
    setFileName(`image_from_base64.${extension}`);

    toast({ title: 'Conversion Successful', description: 'Image rendered from Base64 string.' });
  };

  const handleDownload = () => {
    if (!imagePreview) {
      toast({ title: 'No Image', description: 'No image to download.', variant: 'destructive' });
      return;
    }
    const link = document.createElement('a');
    link.href = imagePreview;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: 'Download Started', description: `Downloading ${fileName}.` });
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Paste a Base64 encoded image Data URI (e.g., <code>data:image/png;base64,...</code>) into the textarea below to convert it back into an image.
        If you only paste the raw Base64 data, the tool will attempt to render it as a PNG.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Base64 Input</CardTitle>
          <CardDescription>Paste your Base64 Data URI here.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={base64Input}
            onChange={(e) => setBase64Input(e.target.value)}
            placeholder="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA..."
            rows={8}
            className="text-sm font-mono resize-y"
          />
          <Button onClick={handleConvert} className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
            <Wand2 className="mr-2 h-4 w-4" /> Convert to Image
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {imagePreview && (
        <Card>
          <CardHeader>
            <CardTitle>Image Preview</CardTitle>
            <CardDescription>This is the image rendered from the Base64 string.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center p-4 bg-muted/30 rounded-md overflow-hidden">
            <Image 
                src={imagePreview} 
                alt="Rendered from Base64" 
                width={400} 
                height={300} 
                style={{ objectFit: 'contain', maxHeight: '400px', maxWidth: '100%', backgroundColor: 'white' }} 
                data-ai-hint="base64 decoded image"
                onError={() => {
                    setError("Failed to render image. The Base64 string might be corrupted or not a valid image.");
                    setImagePreview(null);
                }}
            />
          </CardContent>
          <CardFooter>
            <Button onClick={handleDownload} variant="outline">
              <Download className="mr-2 h-4 w-4" /> Download Image
            </Button>
          </CardFooter>
        </Card>
      )}

      {!imagePreview && !error && (
        <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-border rounded-lg min-h-[200px]">
          <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-muted-foreground">Enter Base64 to see the image</p>
          <p className="text-sm text-muted-foreground">The converted image will appear here.</p>
        </div>
      )}
    </div>
  );
}
