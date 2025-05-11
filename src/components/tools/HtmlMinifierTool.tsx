
"use client";

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Copy, Wand2, Trash2, Minimize2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

function minifyHtml(htmlString: string): string {
  try {
    let minified = htmlString;

    // Remove HTML comments
    minified = minified.replace(/<!--[\s\S]*?-->/g, '');

    // Remove whitespace between tags (but not within <pre>, <textarea>, <script>, <style>)
    // This is a simplified approach and might not be perfect for all edge cases.
    minified = minified.replace(/>\s+</g, '><');
    
    // Collapse multiple whitespace characters (spaces, tabs, newlines) into a single space
    // Be careful not to overly aggressivly remove newlines that might be significant in <pre> or content.
    // This specific regex tries to be conservative by targeting areas around tags mainly.
    minified = minified.replace(/\s+/g, ' ');

    // Trim leading/trailing whitespace from the whole string
    minified = minified.trim();
    
    return minified;
  } catch (e: any) {
    console.error("HTML Minification Error:", e);
    throw new Error("Error minifying HTML: " + e.message);
  }
}

export function HtmlMinifierTool() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const { toast } = useToast();

  const handleMinify = () => {
    if (!inputText.trim()) {
      setOutputText('');
      toast({ title: 'Input is empty', description: 'Please enter some HTML to minify.', variant: 'default' });
      return;
    }
    try {
      const minifiedHtml = minifyHtml(inputText);
      setOutputText(minifiedHtml);
      toast({ title: 'HTML Minified!', description: 'Your HTML has been successfully minified.' });
    } catch (e: any) {
      setOutputText('');
      toast({ title: 'Minification Error', description: e.message, variant: 'destructive' });
    }
  };

  const handleCopy = () => {
    if (!outputText) {
      toast({ title: 'Nothing to copy', description: 'Output is empty.', variant: 'destructive' });
      return;
    }
    navigator.clipboard.writeText(outputText);
    toast({ title: 'Copied to clipboard!', description: 'Minified HTML has been copied.' });
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Paste your HTML code to reduce its size by removing comments and unnecessary whitespace.
      </p>
      <Alert variant="default" className="bg-secondary/30">
          <Minimize2 className="h-4 w-4" />
          <AlertTitle>Note on Minification</AlertTitle>
          <AlertDescription>
            This tool performs basic minification. For complex scenarios or production use, a dedicated build tool or library is recommended for more aggressive and safer optimization.
          </AlertDescription>
      </Alert>
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Input HTML</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              id="input-html"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="<html>\n  <head>\n    <title>My Page</title>\n  </head>\n  <body>\n    <!-- Comment -->\n    <h1>Hello World!</h1>\n  </body>\n</html>"
              rows={12}
              className="text-sm font-mono"
            />
          </CardContent>
        </Card>
        <Card className="bg-secondary/30">
          <CardHeader>
            <CardTitle>Minified HTML</CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <Textarea
              id="output-html"
              value={outputText}
              readOnly
              placeholder="Minified HTML will appear here..."
              rows={12}
              className="text-sm font-mono bg-background"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              className="absolute top-3 right-3"
              aria-label="Copy output HTML"
              disabled={!outputText}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={handleMinify} className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Wand2 className="mr-2 h-4 w-4" /> Minify HTML
        </Button>
        <Button onClick={handleClear} variant="outline">
          <Trash2 className="mr-2 h-4 w-4" /> Clear All
        </Button>
      </div>
    </div>
  );
}
