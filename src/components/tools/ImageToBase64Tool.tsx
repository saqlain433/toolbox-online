
"use client";

import { useState, type ChangeEvent, useRef } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Copy, UploadCloud, XCircle, ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export function ImageToBase64Tool() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [base64String, setBase64String] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Unsupported file type. Please upload an image file (e.g., JPEG, PNG, GIF, WEBP).');
        toast({ title: 'Unsupported File', description: 'Please upload an image.', variant: 'destructive' });
        resetState();
        return;
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setError(`File is too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`);
        toast({ title: 'File Too Large', description: `Max size: ${MAX_FILE_SIZE_MB}MB.`, variant: 'destructive' });
        resetState();
        return;
      }

      setSelectedFile(file);
      setError(null);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setBase64String(reader.result as string); // Full Data URI initially
        toast({ title: 'Image Loaded', description: 'Base64 string generated.' });
      };
      reader.onerror = () => {
        setError('Failed to read the file.');
        toast({ title: 'File Read Error', description: 'Could not read the selected file.', variant: 'destructive' });
        resetState();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCopy = () => {
    if (!base64String) {
      toast({ title: 'Nothing to copy', description: 'No Base64 string generated.', variant: 'destructive' });
      return;
    }
    navigator.clipboard.writeText(base64String);
    toast({ title: 'Copied to clipboard!', description: 'Base64 string has been copied.' });
  };

  const resetState = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setBase64String('');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Upload an image file (JPEG, PNG, GIF, WEBP, max {MAX_FILE_SIZE_MB}MB) to convert it into a Base64 encoded string.
        The generated string includes the Data URI scheme (e.g., <code>data:image/png;base64,...</code>).
      </p>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image-upload">Upload Image</Label>
            <div className="flex items-center gap-2">
              <Input id="image-upload" type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} className="flex-grow" />
              {selectedFile && (
                <Button variant="ghost" size="icon" onClick={resetState} aria-label="Clear image">
                  <XCircle className="h-5 w-5 text-destructive" />
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">Max file size: {MAX_FILE_SIZE_MB}MB. Supported formats: common image types.</p>
          </div>

          {error && (
            <Alert variant="destructive">
              <ImageIcon className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {imagePreview && selectedFile && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Image Preview</CardTitle>
              <CardDescription>
                {selectedFile.name} ({formatFileSize(selectedFile.size)}) - {selectedFile.type}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center items-center aspect-video bg-muted/30 rounded-md overflow-hidden">
              <Image src={imagePreview} alt="Selected image preview" width={300} height={200} style={{ objectFit: 'contain', maxHeight: '200px', maxWidth: '100%' }} data-ai-hint="uploaded image content" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Base64 Data URI</CardTitle>
              <CardDescription>This is the full Data URI for your image.</CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <Textarea
                value={base64String}
                readOnly
                rows={8}
                className="text-sm font-mono bg-background resize-y"
                placeholder="Base64 string will appear here..."
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                className="absolute top-3 right-3"
                aria-label="Copy Base64 string"
                disabled={!base64String}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {!imagePreview && (
        <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-border rounded-lg min-h-[200px]">
          <UploadCloud className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-muted-foreground">Upload an image to convert</p>
          <p className="text-sm text-muted-foreground">Your image preview and Base64 string will appear here.</p>
        </div>
      )}
    </div>
  );
}
