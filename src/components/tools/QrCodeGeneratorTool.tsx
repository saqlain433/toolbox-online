
"use client";

import { useState, useRef, useEffect, type ChangeEvent } from 'react';
import QRCodeStyling, {
  type DotType,
  type CornerSquareType,
  type CornerDotType,
  type ErrorCorrectionLevel,
  type Options as QRCodeStylingOptions,
  type DownloadExtension
} from 'qr-code-styling';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, RefreshCw, ImageIcon, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';

const MAX_LOGO_SIZE_MB = 1;
const MAX_LOGO_SIZE_BYTES = MAX_LOGO_SIZE_MB * 1024 * 1024;

const dotStyleOptions: { value: DotType; label: string }[] = [
  { value: 'rounded', label: 'Rounded' },
  { value: 'dots', label: 'Dots' },
  { value: 'classy', label: 'Classy' },
  { value: 'classy-rounded', label: 'Classy Rounded' },
  { value: 'square', label: 'Square' },
  { value: 'extra-rounded', label: 'Extra Rounded' },
];

const cornerSquareStyleOptions: { value: CornerSquareType; label: string }[] = [
  { value: 'extra-rounded', label: 'Extra Rounded' },
  { value: 'dot', label: 'Dot' },
  { value: 'square', label: 'Square' },
];

const cornerDotStyleOptions: { value: CornerDotType; label: string }[] = [
  { value: 'dot', label: 'Dot' },
  { value: 'square', label: 'Square' },
];

const errorCorrectionLevelOptions: { value: ErrorCorrectionLevel; label: string }[] = [
  { value: 'L', label: 'Low (L)' },
  { value: 'M', label: 'Medium (M)' },
  { value: 'Q', label: 'Quartile (Q)' },
  { value: 'H', label: 'High (H)' },
];

export function QrCodeGeneratorTool() {
  const [text, setText] = useState('https://toolbox.online');
  const [qrCodeInstance, setQrCodeInstance] = useState<QRCodeStyling | null>(null);
  
  // Styling State
  const [qrSize, setQrSize] = useState(300);
  const [qrMargin, setQrMargin] = useState(10);
  const [dotsStyle, setDotsStyle] = useState<DotType>('rounded');
  const [dotsColor, setDotsColor] = useState('#000000');
  const [cornerSquareStyle, setCornerSquareStyle] = useState<CornerSquareType>('extra-rounded');
  const [cornerSquareColor, setCornerSquareColor] = useState('#000000');
  const [cornerDotStyle, setCornerDotStyle] = useState<CornerDotType>('dot');
  const [cornerDotColor, setCornerDotColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState<ErrorCorrectionLevel>('Q');

  // Logo State
  const [logoSrc, setLogoSrc] = useState<string | null>(null);
  const [logoSize, setLogoSize] = useState(0.3); // Relative to QR code size (0 to 1)
  const [logoMargin, setLogoMargin] = useState(5);
  const [hideLogoBackgroundDots, setHideLogoBackgroundDots] = useState(true);

  const [fileExt, setFileExt] = useState<DownloadExtension>("png");
  const { toast } = useToast();
  const qrRef = useRef<HTMLDivElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const generateQrOptions = (): QRCodeStylingOptions => ({
    width: qrSize,
    height: qrSize,
    data: text,
    margin: qrMargin,
    dotsOptions: { color: dotsColor, type: dotsStyle },
    backgroundOptions: { color: backgroundColor },
    cornersSquareOptions: { color: cornerSquareColor, type: cornerSquareStyle },
    cornersDotOptions: { color: cornerDotColor, type: cornerDotStyle },
    qrOptions: { errorCorrectionLevel, mode: 'Byte', typeNumber: 0 },
    imageOptions: {
      src: logoSrc || undefined,
      hideBackgroundDots: hideLogoBackgroundDots,
      imageSize: logoSize,
      margin: logoMargin,
      crossOrigin: 'anonymous',
    },
  });

  useEffect(() => {
    if (qrRef.current) {
      // Clear any previous QR code before appending a new one
      while (qrRef.current.firstChild) {
        qrRef.current.removeChild(qrRef.current.firstChild);
      }
      const newQrCodeInstance = new QRCodeStyling(generateQrOptions());
      newQrCodeInstance.append(qrRef.current);
      setQrCodeInstance(newQrCodeInstance);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Initial setup on mount

  const updateQrCode = () => {
    if (qrCodeInstance) {
      qrCodeInstance.update(generateQrOptions());
    } else if (qrRef.current) { // Fallback if instance somehow not set
        while (qrRef.current.firstChild) { // Clear before appending
            qrRef.current.removeChild(qrRef.current.firstChild);
        }
        const newQrCodeInstance = new QRCodeStyling(generateQrOptions());
        newQrCodeInstance.append(qrRef.current);
        setQrCodeInstance(newQrCodeInstance);
    }
  };

  // Debounced update
  useEffect(() => {
    const handler = setTimeout(() => {
      updateQrCode();
    }, 300);
    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, qrSize, qrMargin, dotsStyle, dotsColor, cornerSquareStyle, cornerSquareColor, cornerDotStyle, cornerDotColor, backgroundColor, errorCorrectionLevel, logoSrc, logoSize, logoMargin, hideLogoBackgroundDots]);

  const handleDownload = () => {
    qrCodeInstance?.download({ name: "qrcode", extension: fileExt });
    toast({ title: "Download Started", description: `QR Code downloading as ${fileExt.toUpperCase()}.` });
  };

  const handleLogoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > MAX_LOGO_SIZE_BYTES) {
        toast({ title: "Logo Too Large", description: `Max logo size: ${MAX_LOGO_SIZE_MB}MB.`, variant: "destructive" });
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast({ title: "Invalid File Type", description: `Please upload an image file for the logo.`, variant: "destructive" });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearLogo = () => {
    setLogoSrc(null);
    if (logoInputRef.current) {
      logoInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Enter text or URL, customize appearance, add a logo, and download your QR code.
      </p>
      
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Column 1: Data and Basic Styling */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader><CardTitle>QR Data & Basic Style</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="qr-text">Text or URL</Label>
                <Input id="qr-text" value={text} onChange={(e) => setText(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="qr-size">Size (px)</Label>
                <Input id="qr-size" type="number" value={qrSize} onChange={(e) => setQrSize(Math.max(50, Math.min(1000, parseInt(e.target.value, 10) || 300)))} min="50" max="1000" />
              </div>
              <div>
                <Label htmlFor="qr-margin">QR Margin (px around code)</Label>
                <Input id="qr-margin" type="number" value={qrMargin} onChange={(e) => setQrMargin(Math.max(0, parseInt(e.target.value, 10) || 0))} min="0" max="100" />
              </div>
              <div>
                <Label htmlFor="bg-color">Background Color</Label>
                <Input id="bg-color" type="color" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} className="h-10" />
              </div>
               <div>
                <Label htmlFor="error-correction">Error Correction</Label>
                <Select value={errorCorrectionLevel} onValueChange={(v) => setErrorCorrectionLevel(v as ErrorCorrectionLevel)}>
                  <SelectTrigger id="error-correction"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {errorCorrectionLevelOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Column 2: Advanced Styling & Logo */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader><CardTitle>Dots & Corners</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="dots-style">Dots Style</Label>
                <Select value={dotsStyle} onValueChange={(v) => setDotsStyle(v as DotType)}>
                  <SelectTrigger id="dots-style"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {dotStyleOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="dots-color">Dots Color</Label>
                <Input id="dots-color" type="color" value={dotsColor} onChange={(e) => setDotsColor(e.target.value)} className="h-10" />
              </div>
              <div>
                <Label htmlFor="cs-style">Corner Square Style</Label>
                <Select value={cornerSquareStyle} onValueChange={(v) => setCornerSquareStyle(v as CornerSquareType)}>
                  <SelectTrigger id="cs-style"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {cornerSquareStyleOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="cs-color">Corner Square Color</Label>
                <Input id="cs-color" type="color" value={cornerSquareColor} onChange={(e) => setCornerSquareColor(e.target.value)} className="h-10" />
              </div>
              <div>
                <Label htmlFor="cd-style">Corner Dot Style</Label>
                <Select value={cornerDotStyle} onValueChange={(v) => setCornerDotStyle(v as CornerDotType)}>
                  <SelectTrigger id="cd-style"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {cornerDotStyleOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="cd-color">Corner Dot Color</Label>
                <Input id="cd-color" type="color" value={cornerDotColor} onChange={(e) => setCornerDotColor(e.target.value)} className="h-10" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader><CardTitle>Logo</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="logo-upload">Upload Logo (max {MAX_LOGO_SIZE_MB}MB)</Label>
                <Input id="logo-upload" type="file" accept="image/*" onChange={handleLogoUpload} ref={logoInputRef} />
              </div>
              {logoSrc && <Button variant="outline" size="sm" onClick={clearLogo}><Trash2 className="mr-2 h-4 w-4" />Clear Logo</Button>}
              <div>
                <Label htmlFor="logo-size">Logo Size (relative to QR): {logoSize.toFixed(2)}</Label>
                <Slider id="logo-size" min={0.1} max={0.5} step={0.05} value={[logoSize]} onValueChange={([v]) => setLogoSize(v)} disabled={!logoSrc}/>
              </div>
              <div>
                <Label htmlFor="logo-margin">Logo Margin (px around logo)</Label>
                <Input id="logo-margin" type="number" value={logoMargin} onChange={(e) => setLogoMargin(Math.max(0, parseInt(e.target.value,10) || 0))} min="0" max="20" disabled={!logoSrc}/>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="hide-dots" checked={hideLogoBackgroundDots} onCheckedChange={(checked) => setHideLogoBackgroundDots(Boolean(checked))} disabled={!logoSrc}/>
                <Label htmlFor="hide-dots">Hide background dots under logo</Label>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Column 3: Preview & Download */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="sticky top-4">
            <CardHeader><CardTitle>Preview & Download</CardTitle></CardHeader>
            <CardContent ref={qrRef} className="p-4 flex items-center justify-center bg-muted/20 min-h-[200px] aspect-square overflow-hidden">
              {/* QR Code will be appended here by the library */}
            </CardContent>
            <CardFooter className="pt-6 flex-col sm:flex-row gap-2 w-full">
              <Select value={fileExt} onValueChange={(v) => setFileExt(v as DownloadExtension)}>
                <SelectTrigger className="w-full sm:w-[120px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="png">PNG</SelectItem>
                  <SelectItem value="jpeg">JPEG</SelectItem>
                  <SelectItem value="webp">WEBP</SelectItem>
                  <SelectItem value="svg">SVG</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleDownload} className="w-full sm:flex-1 bg-accent hover:bg-accent/90 text-accent-foreground" disabled={!qrCodeInstance}>
                <Download className="mr-2 h-4 w-4" /> Download
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      <Button onClick={updateQrCode} variant="outline" className="w-full mt-4 lg:hidden">
        <RefreshCw className="mr-2 h-4 w-4" /> Refresh QR Code Manually (if needed)
      </Button>
    </div>
  );
}
