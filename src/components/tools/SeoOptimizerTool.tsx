"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { generateSeoDescription, type GenerateSeoDescriptionInput } from '@/ai/flows/seo-description-generator';
import { Loader2, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  toolName: z.string().min(3, 'Tool name must be at least 3 characters long.'),
  toolDescription: z.string().min(20, 'Tool description must be at least 20 characters long.'),
});

type SeoOptimizerFormValues = z.infer<typeof formSchema>;

export function SeoOptimizerTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [seoResult, setSeoResult] = useState<string | null>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SeoOptimizerFormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<SeoOptimizerFormValues> = async (data) => {
    setIsLoading(true);
    setSeoResult(null);
    try {
      const result = await generateSeoDescription(data as GenerateSeoDescriptionInput);
      setSeoResult(result.seoDescription);
      toast({
        title: "SEO Description Generated!",
        description: "Your AI-powered SEO description is ready.",
        variant: "default",
      });
    } catch (error) {
      console.error('Error generating SEO description:', error);
      toast({
        title: "Error",
        description: "Failed to generate SEO description. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Enter the name and a detailed description of your tool. Our AI will generate a concise,
        SEO-optimized meta description (100-150 words) to help improve its search engine visibility.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="toolName">Tool Name</Label>
          <Input
            id="toolName"
            {...register('toolName')}
            placeholder="e.g., Awesome Image Resizer"
            className={errors.toolName ? 'border-destructive' : ''}
          />
          {errors.toolName && <p className="text-sm text-destructive mt-1">{errors.toolName.message}</p>}
        </div>
        <div>
          <Label htmlFor="toolDescription">Tool Description</Label>
          <Textarea
            id="toolDescription"
            {...register('toolDescription')}
            rows={5}
            placeholder="Provide a detailed description of what your tool does, its features, and benefits..."
            className={errors.toolDescription ? 'border-destructive' : ''}
          />
          {errors.toolDescription && <p className="text-sm text-destructive mt-1">{errors.toolDescription.message}</p>}
        </div>
        <div className="flex space-x-2">
          <Button type="submit" disabled={isLoading} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            Generate SEO Description
          </Button>
           <Button type="button" variant="outline" onClick={() => { reset(); setSeoResult(null); }} disabled={isLoading}>
            Clear
          </Button>
        </div>
      </form>

      {seoResult && (
        <Card className="mt-6 bg-secondary/50">
          <CardHeader>
            <CardTitle>Generated SEO Description</CardTitle>
            <CardDescription>Copy and use this description for your tool's meta tag.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea value={seoResult} readOnly rows={5} className="bg-background" />
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(seoResult);
                toast({ title: "Copied to clipboard!" });
              }}
            >
              Copy Description
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
