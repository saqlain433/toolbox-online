
"use client";

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Copy, Wand2, Trash2, FileJson } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Basic XML pretty printer
function prettyPrintXml(xmlString: string): string {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "application/xml");

    const parserError = xmlDoc.getElementsByTagName("parsererror");
    if (parserError.length > 0) {
      // Try to extract a more specific error message
      const errorDetails = parserError[0].textContent || "Unknown parsing error";
      // Remove XML structure from error message if present
      const cleanError = errorDetails.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      throw new Error(`Invalid XML: ${cleanError}`);
    }
    
    const xsltDoc = new DOMParser().parseFromString([
        // Reformat XML according to XSLT processing rules.
        '<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">',
        '  <xsl:output method="xml" indent="yes" encoding="UTF-8"/>',
        '  <xsl:strip-space elements="*"/>',
        '  <xsl:template match="/">',
        '    <xsl:copy-of select="."/>',
        '  </xsl:template>',
        '</xsl:stylesheet>',
    ].join('\n'), 'application/xml');

    const xsltProcessor = new XSLTProcessor();    
    xsltProcessor.importStylesheet(xsltDoc);
    const resultDoc = xsltProcessor.transformToDocument(xmlDoc);
    const prettyXml = new XMLSerializer().serializeToString(resultDoc);
    
    // Ensure there's an XML declaration
    if (!prettyXml.startsWith('<?xml')) {
        return '<?xml version="1.0" encoding="UTF-8"?>\n' + prettyXml;
    }
    return prettyXml;

  } catch (e: any) {
    throw new Error(e.message || "Error formatting XML.");
  }
}


export function XmlFormatterTool() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFormat = () => {
    setError(null);
    if (!inputText.trim()) {
      setOutputText('');
      toast({ title: 'Input is empty', description: 'Please enter some XML to format.', variant: 'default' });
      return;
    }
    try {
      const formattedXml = prettyPrintXml(inputText);
      setOutputText(formattedXml);
      toast({ title: 'XML Formatted!', description: 'Your XML has been successfully formatted.' });
    } catch (e: any) {
      setError(e.message);
      setOutputText('');
      toast({ title: 'Formatting Error', description: e.message, variant: 'destructive' });
    }
  };

  const handleCopy = () => {
    if (!outputText) {
      toast({ title: 'Nothing to copy', description: 'Output is empty.', variant: 'destructive' });
      return;
    }
    navigator.clipboard.writeText(outputText);
    toast({ title: 'Copied to clipboard!', description: 'Formatted XML has been copied.' });
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
    setError(null);
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Paste your XML data into the input field. The tool will attempt to format it for readability and check for well-formedness.
      </p>
      {error && (
        <Alert variant="destructive">
          <FileJson className="h-4 w-4" />
          <AlertTitle>XML Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="input-xml">Input XML</Label>
          <Textarea
            id="input-xml"
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              if (error) setError(null); 
            }}
            placeholder='<root><element attribute="value">Content</element></root>'
            rows={12}
            className="text-sm font-mono"
          />
        </div>
        <div>
          <Label htmlFor="output-xml">Formatted XML</Label>
          <div className="relative">
            <Textarea
              id="output-xml"
              value={outputText}
              readOnly
              placeholder="Formatted XML will appear here..."
              rows={12}
              className="text-sm font-mono bg-muted/30"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              className="absolute top-2 right-2"
              aria-label="Copy output XML"
              disabled={!outputText}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={handleFormat} className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Wand2 className="mr-2 h-4 w-4" /> Format XML
        </Button>
        <Button onClick={handleClear} variant="outline">
          <Trash2 className="mr-2 h-4 w-4" /> Clear All
        </Button>
      </div>
    </div>
  );
}
