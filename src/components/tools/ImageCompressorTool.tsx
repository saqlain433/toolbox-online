
"use client";

import { useState, useRef, type ChangeEvent } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, UploadCloud, Image as ImageIcon, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export function ImageCompressorTool() {
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [originalImagePreview, setOriginalImagePreview] = useState<string | null>(null);
  const [compressedImagePreview, setCompressedImagePreview] = useState<string | null>(null);
  const [quality, setQuality] = useState(0.7); // Default quality 70%
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setError('Unsupported file type. Please upload JPEG, PNG, or WEBP images.');
        toast({ title: 'Unsupported File', description: 'Please upload JPEG, PNG, or WEBP.', variant: 'destructive' });
        resetState();
        return;
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setError(`File is too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`);
        toast({ title: 'File Too Large', description: `Max size: ${MAX_FILE_SIZE_MB}MB.`, variant: 'destructive' });
        resetState();
        return;
      }
      
      setOriginalImage(file);
      setOriginalSize(file.size);
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImagePreview(reader.result as string);
        setCompressedImagePreview(null); // Clear previous compressed image
        setCompressedSize(0);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const compressImage = () => {
    if (!originalImage || !originalImagePreview) {
      toast({ title: 'No Image', description: 'Please upload an image first.', variant: 'destructive' });
      return;
    }
    setIsProcessing(true);
    setError(null);

    const img = document.createElement('img');
    img.src = originalImagePreview;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setError('Could not get canvas context.');
        setIsProcessing(false);
        return;
      }
      ctx.drawImage(img, 0, 0, img.width, img.height);

      // Determine output type. Prefer original type, fallback to JPEG.
      let outputType = originalImage.type;
      if (outputType === 'image/png' && quality < 1) { // PNG compression is lossless, quality slider mainly for JPEG/WEBP
        outputType = 'image/jpeg'; // Convert PNG to JPEG if quality is reduced for better compression
        toast({ title: 'Note', description: 'PNGs are compressed losslessly. For significant size reduction with quality adjustment, it will be converted to JPEG.'});
      } else if (!['image/jpeg', 'image/webp'].includes(outputType)) {
        outputType = 'image/jpeg'; // Default to JPEG for other types
      }
      
      const compressedDataUrl = canvas.toDataURL(outputType, outputType === 'image/png' ? undefined : quality);
      setCompressedImagePreview(compressedDataUrl);

      // Calculate compressed size
      fetch(compressedDataUrl)
        .then(res => res.blob())
        .then(blob => {
            setCompressedSize(blob.size);
            setIsProcessing(false);
            toast({ title: 'Compression Complete!', description: 'Image compressed successfully.' });
        });
    };
    img.onerror = () => {
        setError('Failed to load image for compression.');
        setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!compressedImagePreview || !originalImage) return;
    const link = document.createElement('a');
    link.href = compressedImagePreview;
    const nameParts = originalImage.name.split('.');
    const extension = nameParts.pop();
    let outputExtension = extension;
    if (originalImage.type === 'image/png' && quality < 1) outputExtension = 'jpg';
    else if (!['jpg', 'jpeg', 'webp'].includes(extension?.toLowerCase() || '')) outputExtension = 'jpg';

    link.download = `${nameParts.join('.')}_compressed.${outputExtension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: 'Download Started!', description: 'Compressed image download has begun.' });
  };
  
  const resetState = () => {
    setOriginalImage(null);
    setOriginalImagePreview(null);
    setCompressedImagePreview(null);
    setError(null);
    setOriginalSize(0);
    setCompressedSize(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

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
        Upload an image (JPEG, PNG, WEBP, max {MAX_FILE_SIZE_MB}MB). Adjust the quality and compress.
        PNGs are compressed losslessly; for quality-based reduction, they'll be converted to JPEG.
      </p>
      
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image-upload">Upload Image</Label>
            <div className="flex items-center gap-2">
                <Input id="image-upload" type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} ref={fileInputRef} className="flex-grow"/>
                {originalImage && (
                    <Button variant="ghost" size="icon" onClick={resetState} aria-label="Clear image">
                        <XCircle className="h-5 w-5 text-destructive"/>
                    </Button>
                )}
            </div>
            <p className="text-xs text-muted-foreground">Max file size: {MAX_FILE_SIZE_MB}MB. Supported formats: JPG, PNG, WEBP.</p>
          </div>

          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {originalImagePreview && (
            <>
              <div className="space-y-2">
                <Label htmlFor="quality-slider">Quality: {Math.round(quality * 100)}%</Label>
                <Slider
                  id="quality-slider"
                  min={0.1}
                  max={1}
                  step={0.01}
                  value={[quality]}
                  onValueChange={([val]) => setQuality(val)}
                  disabled={isProcessing || originalImage?.type === 'image/png'} // Disable for PNG unless we convert
                />
                 {originalImage?.type === 'image/png' && <p className="text-xs text-muted-foreground">Quality slider mainly affects JPEG/WEBP. PNGs will be losslessly compressed or converted to JPEG if quality is reduced.</p>}
              </div>
              <Button onClick={compressImage} disabled={isProcessing || !originalImagePreview} className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
                {isProcessing ? 'Processing...' : <><ImageIcon className="mr-2 h-4 w-4" /> Compress Image</>}
              </Button>
            </>
          )}
        </CardContent>
      </Card>


      {(originalImagePreview || compressedImagePreview) && (
        <div className="grid md:grid-cols-2 gap-6">
          {originalImagePreview && (
            <Card>
              <CardHeader>
                <CardTitle>Original Image</CardTitle>
                {originalSize > 0 && <CardDescription>Size: {formatFileSize(originalSize)}</CardDescription>}
              </CardHeader>
              <CardContent className="flex justify-center items-center aspect-video bg-muted/30 rounded-md overflow-hidden">
                <Image src={originalImagePreview} alt="Original" width={400} height={300} style={{ objectFit: 'contain', maxHeight: '300px', maxWidth: '100%' }} data-ai-hint="uploaded image" />
              </CardContent>
            </Card>
          )}
          {compressedImagePreview && (
            <Card>
              <CardHeader>
                <CardTitle>Compressed Image</CardTitle>
                {compressedSize > 0 && <CardDescription>Size: {formatFileSize(compressedSize)} ({(100 - (compressedSize/originalSize)*100).toFixed(1)}% smaller)</CardDescription>}
              </CardHeader>
              <CardContent className="flex justify-center items-center aspect-video bg-muted/30 rounded-md overflow-hidden">
                <Image src={compressedImagePreview} alt="Compressed" width={400} height={300} style={{ objectFit: 'contain', maxHeight: '300px', maxWidth: '100%' }} data-ai-hint="compressed image"/>
              </CardContent>
              <CardFooter>
                <Button onClick={handleDownload} className="w-full">
                  <Download className="mr-2 h-4 w-4" /> Download Compressed Image
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      )}
       {!originalImagePreview && (
         <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-border rounded-lg min-h-[200px]">
            <UploadCloud className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-muted-foreground">Upload an image to get started</p>
            <p className="text-sm text-muted-foreground">Your image preview will appear here.</p>
        </div>
       )}
    </div>
  );
}
