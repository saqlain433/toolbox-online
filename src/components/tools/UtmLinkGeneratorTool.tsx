
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Link2, Copy, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const utmSchema = z.object({
  baseUrl: z.string().url({ message: "Please enter a valid URL." }),
  utmSource: z.string().min(1, "Campaign Source is required."),
  utmMedium: z.string().min(1, "Campaign Medium is required."),
  utmCampaign: z.string().min(1, "Campaign Name is required."),
  utmTerm: z.string().optional(),
  utmContent: z.string().optional(),
});

type UtmFormValues = z.infer<typeof utmSchema>;

export function UtmLinkGeneratorTool() {
  const [generatedUrl, setGeneratedUrl] = useState<string>('');
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UtmFormValues>({
    resolver: zodResolver(utmSchema),
  });

  const onSubmit: SubmitHandler<UtmFormValues> = (data) => {
    try {
      const url = new URL(data.baseUrl);
      if (data.utmSource) url.searchParams.set('utm_source', data.utmSource);
      if (data.utmMedium) url.searchParams.set('utm_medium', data.utmMedium);
      if (data.utmCampaign) url.searchParams.set('utm_campaign', data.utmCampaign);
      if (data.utmTerm) url.searchParams.set('utm_term', data.utmTerm);
      if (data.utmContent) url.searchParams.set('utm_content', data.utmContent);
      
      setGeneratedUrl(url.toString());
      toast({ title: 'UTM Link Generated!', description: 'Your tracked URL is ready.' });
    } catch (e: any) {
      toast({ title: 'Error', description: e.message || 'Failed to generate URL.', variant: 'destructive' });
      setGeneratedUrl('');
    }
  };

  const handleCopy = () => {
    if (!generatedUrl) {
      toast({ title: 'Nothing to copy', description: 'Generate a URL first.', variant: 'destructive' });
      return;
    }
    navigator.clipboard.writeText(generatedUrl);
    toast({ title: 'Copied to clipboard!', description: 'UTM link copied.' });
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Create custom URLs with UTM parameters to track your marketing campaigns effectively in Google Analytics and other analytics platforms.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>UTM Parameters</CardTitle>
            <CardDescription>Fill in the fields to build your UTM-tracked URL. Required fields are marked with <span className="text-destructive">*</span>.</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="baseUrl">Website URL <span className="text-destructive">*</span></Label>
              <Input id="baseUrl" {...register('baseUrl')} type="url" placeholder="https://www.example.com" />
              {errors.baseUrl && <p className="text-sm text-destructive mt-1">{errors.baseUrl.message}</p>}
            </div>
            <div>
              <Label htmlFor="utmSource">Campaign Source <span className="text-destructive">*</span></Label>
              <Input id="utmSource" {...register('utmSource')} placeholder="e.g., google, newsletter" />
              {errors.utmSource && <p className="text-sm text-destructive mt-1">{errors.utmSource.message}</p>}
            </div>
            <div>
              <Label htmlFor="utmMedium">Campaign Medium <span className="text-destructive">*</span></Label>
              <Input id="utmMedium" {...register('utmMedium')} placeholder="e.g., cpc, email, social" />
              {errors.utmMedium && <p className="text-sm text-destructive mt-1">{errors.utmMedium.message}</p>}
            </div>
            <div>
              <Label htmlFor="utmCampaign">Campaign Name <span className="text-destructive">*</span></Label>
              <Input id="utmCampaign" {...register('utmCampaign')} placeholder="e.g., spring_sale, product_launch" />
              {errors.utmCampaign && <p className="text-sm text-destructive mt-1">{errors.utmCampaign.message}</p>}
            </div>
            <div>
              <Label htmlFor="utmTerm">Campaign Term (Optional)</Label>
              <Input id="utmTerm" {...register('utmTerm')} placeholder="Keywords for paid search" />
            </div>
            <div>
              <Label htmlFor="utmContent">Campaign Content (Optional)</Label>
              <Input id="utmContent" {...register('utmContent')} placeholder="Differentiate ads or links" />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-2">
             <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Wand2 className="mr-2 h-4 w-4" /> Generate UTM Link
            </Button>
            <Button type="button" variant="outline" onClick={() => {reset(); setGeneratedUrl('');}}>
                Clear Fields
            </Button>
          </CardFooter>
        </Card>
      </form>

      {generatedUrl && (
        <Card className="mt-6 bg-secondary/50">
          <CardHeader>
            <CardTitle className="flex items-center"><Link2 className="mr-2 h-5 w-5" /> Generated UTM Link</CardTitle>
            <CardDescription>Use this URL in your marketing campaigns for tracking.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea value={generatedUrl} readOnly rows={3} className="text-sm font-mono bg-background" />
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={handleCopy}>
              <Copy className="mr-2 h-4 w-4" /> Copy URL
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
