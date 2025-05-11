"use client";

import { useState, useRef, useEffect } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Download, RefreshCw } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const qrOptions = {
  width: 300,
  height: 300,
  margin: 5,
  qrOptions: {
    typeNumber: 0,
    mode: 'Byte' as const, // Explicitly type 'Byte'
    errorCorrectionLevel: 'Q' as const, // Explicitly type 'Q'
  },
  imageOptions: {
    hideBackgroundDots: true,
    imageSize: 0.4,
    margin: 5,
    crossOrigin: 'anonymous',
  },
  dotsOptions: {
    color: '#000000', // default black
    type: 'rounded' as const, // Explicitly type
  },
  backgroundOptions: {
    color: '#ffffff', // default white
  },
  cornersSquareOptions: {
    color: '#000000',
    type: 'extra-rounded' as const,
  },
  cornersDotOptions: {
    color: '#000000',
    type: 'dot' as const,
  }
};


export function QrCodeGeneratorTool() {
  const [text, setText] = useState('https://example.com');
  const [qrCodeInstance, setQrCodeInstance] = useState<QRCodeStyling | null>(null);
  const [dotsColor, setDotsColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [qrSize, setQrSize] = useState(300);
  const [fileExt, setFileExt] = useState<"png" | "jpeg" | "webp" | "svg">("png");

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      const qrCode = new QRCodeStyling({
        ...qrOptions,
        width: qrSize,
        height: qrSize,
        data: text,
        dotsOptions: { ...qrOptions.dotsOptions, color: dotsColor },
        backgroundOptions: { ...qrOptions.backgroundOptions, color: backgroundColor },
      });
      qrCode.append(ref.current);
      setQrCodeInstance(qrCode);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Initial setup

  const updateQrCode = () => {
    if (qrCodeInstance) {
      qrCodeInstance.update({
        data: text,
        width: qrSize,
        height: qrSize,
        dotsOptions: { ...qrOptions.dotsOptions, color: dotsColor },
        backgroundOptions: { ...qrOptions.backgroundOptions, color: backgroundColor },
      });
    } else if (ref.current) {
       // Fallback to create if not initialized
      const qrCode = new QRCodeStyling({
        ...qrOptions,
        width: qrSize,
        height: qrSize,
        data: text,
        dotsOptions: { ...qrOptions.dotsOptions, color: dotsColor },
        backgroundOptions: { ...qrOptions.backgroundOptions, color: backgroundColor },
      });
      qrCode.append(ref.current);
      setQrCodeInstance(qrCode);
    }
  };

  const handleDownload = () => {
    qrCodeInstance?.download({ name: "qrcode", extension: fileExt });
  };

  // Debounce update
  useEffect(() => {
    const handler = setTimeout(() => {
      updateQrCode();
    }, 300);
    return () => clearTimeout(handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, dotsColor, backgroundColor, qrSize]);

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Enter any text or URL to generate a QR code. Customize colors and download your QR code in various formats.
      </p>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="qr-text">Text or URL</Label>
            <Input
              id="qr-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text or URL for QR code"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dots-color">Dots Color</Label>
              <Input
                id="dots-color"
                type="color"
                value={dotsColor}
                onChange={(e) => setDotsColor(e.target.value)}
                className="h-10"
              />
            </div>
            <div>
              <Label htmlFor="bg-color">Background Color</Label>
              <Input
                id="bg-color"
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="h-10"
              />
            </div>
          </div>
           <div>
            <Label htmlFor="qr-size">Size (px)</Label>
            <Input
              id="qr-size"
              type="number"
              value={qrSize}
              onChange={(e) => setQrSize(Math.max(50, Math.min(1000, parseInt(e.target.value, 10) || 300)))}
              min="50"
              max="1000"
            />
          </div>
          <Button onClick={updateQrCode} variant="outline" className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" /> Update QR Code
          </Button>
        </div>
        
        <Card className="flex flex-col items-center justify-center p-6 bg-secondary/30">
          <CardContent ref={ref} className="p-0 w-auto h-auto flex items-center justify-center"></CardContent>
          {qrCodeInstance && (
            <CardFooter className="pt-6 flex-col sm:flex-row gap-2 w-full">
              <Select value={fileExt} onValueChange={(value: "png" | "jpeg" | "webp" | "svg") => setFileExt(value)}>
                <SelectTrigger className="w-full sm:w-[120px]">
                  <SelectValue placeholder="Format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="png">PNG</SelectItem>
                  <SelectItem value="jpeg">JPEG</SelectItem>
                  <SelectItem value="webp">WEBP</SelectItem>
                  <SelectItem value="svg">SVG</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleDownload} className="w-full sm:flex-1 bg-accent hover:bg-accent/90 text-accent-foreground">
                <Download className="mr-2 h-4 w-4" /> Download QR Code
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
