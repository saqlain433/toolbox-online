
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tag, Code2, Copy, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const metaTagSchema = z.object({
  title: z.string().min(1, "Title is required").max(70, "Title should be concise (max 70 chars)"),
  description: z.string().min(1, "Description is required").max(160, "Meta description is best under 160 chars"),
  keywords: z.string().optional(),
  author: z.string().optional(),
  viewport: z.string().default("width=device-width, initial-scale=1.0"),
  charset: z.string().default("UTF-8"),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImage: z.string().url({ message: "Enter a valid URL for Open Graph image" }).optional().or(z.literal('')),
  twitterCard: z.string().default("summary_large_image"),
  twitterSite: z.string().optional(), // e.g., @username
  twitterCreator: z.string().optional(), // e.g., @username
});

type MetaTagFormValues = z.infer<typeof metaTagSchema>;

export function MetaTagGeneratorTool() {
  const [generatedTags, setGeneratedTags] = useState<string>('');
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<MetaTagFormValues>({
    resolver: zodResolver(metaTagSchema),
    defaultValues: {
      viewport: "width=device-width, initial-scale=1.0",
      charset: "UTF-8",
      twitterCard: "summary_large_image",
    }
  });

  // Sync ogTitle and ogDescription with main title and description if empty
  const titleValue = watch('title');
  const descriptionValue = watch('description');

  const onSubmit: SubmitHandler<MetaTagFormValues> = (data) => {
    let tags = '';
    tags += `<meta charset="${data.charset}">\n`;
    tags += `<meta name="viewport" content="${data.viewport}">\n`;
    tags += `<title>${data.title}</title>\n`;
    tags += `<meta name="description" content="${data.description}">\n`;
    if (data.keywords) tags += `<meta name="keywords" content="${data.keywords}">\n`;
    if (data.author) tags += `<meta name="author" content="${data.author}">\n`;

    // Open Graph Tags
    const ogTitle = data.ogTitle || data.title;
    const ogDescription = data.ogDescription || data.description;
    tags += `\n<!-- Open Graph / Facebook -->\n`;
    tags += `<meta property="og:type" content="website">\n`;
    // You might want an input for og:url
    // tags += `<meta property="og:url" content="YOUR_PAGE_URL_HERE">\n`;
    tags += `<meta property="og:title" content="${ogTitle}">\n`;
    tags += `<meta property="og:description" content="${ogDescription}">\n`;
    if (data.ogImage) tags += `<meta property="og:image" content="${data.ogImage}">\n`;

    // Twitter Card Tags
    tags += `\n<!-- Twitter -->\n`;
    tags += `<meta property="twitter:card" content="${data.twitterCard}">\n`;
    // You might want an input for twitter:url
    // tags += `<meta property="twitter:url" content="YOUR_PAGE_URL_HERE">\n`;
    tags += `<meta property="twitter:title" content="${ogTitle}">\n`; // Often same as OG
    tags += `<meta property="twitter:description" content="${ogDescription}">\n`; // Often same as OG
    if (data.ogImage) tags += `<meta property="twitter:image" content="${data.ogImage}">\n`; // Often same as OG
    if (data.twitterSite) tags += `<meta name="twitter:site" content="${data.twitterSite}">\n`;
    if (data.twitterCreator) tags += `<meta name="twitter:creator" content="${data.twitterCreator}">\n`;
    
    setGeneratedTags(tags.trim());
    toast({ title: 'Meta Tags Generated!', description: 'You can copy the tags below.' });
  };
  
  const handleCopy = () => {
    if (!generatedTags) {
      toast({ title: 'Nothing to copy', description: 'Generate tags first.', variant: 'destructive' });
      return;
    }
    navigator.clipboard.writeText(generatedTags);
    toast({ title: 'Copied to clipboard!', description: 'Meta tags copied.' });
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Fill in the details below to generate common HTML meta tags for your webpage. These tags help with SEO and social media sharing.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Card>
          <CardHeader><CardTitle>Core Meta Tags</CardTitle></CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title <span className="text-destructive">*</span></Label>
              <Input id="title" {...register('title')} placeholder="Your Page Title (max 70 chars)" />
              {errors.title && <p className="text-sm text-destructive mt-1">{errors.title.message}</p>}
            </div>
            <div>
              <Label htmlFor="description">Meta Description <span className="text-destructive">*</span></Label>
              <Input id="description" {...register('description')} placeholder="Your Page Meta Description (max 160 chars)" />
              {errors.description && <p className="text-sm text-destructive mt-1">{errors.description.message}</p>}
            </div>
            <div>
              <Label htmlFor="keywords">Keywords (comma-separated)</Label>
              <Input id="keywords" {...register('keywords')} placeholder="keyword1, keyword2, keyword3" />
            </div>
            <div>
              <Label htmlFor="author">Author</Label>
              <Input id="author" {...register('author')} placeholder="Author Name or Company" />
            </div>
            <div>
              <Label htmlFor="charset">Character Set</Label>
              <Input id="charset" {...register('charset')} />
              {errors.charset && <p className="text-sm text-destructive mt-1">{errors.charset.message}</p>}
            </div>
            <div>
              <Label htmlFor="viewport">Viewport</Label>
              <Input id="viewport" {...register('viewport')} />
              {errors.viewport && <p className="text-sm text-destructive mt-1">{errors.viewport.message}</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Social Media Meta Tags (Open Graph & Twitter)</CardTitle></CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ogTitle">Open Graph Title (optional, uses main title if empty)</Label>
              <Input id="ogTitle" {...register('ogTitle')} placeholder={titleValue || "Same as Main Title"} />
            </div>
            <div>
              <Label htmlFor="ogDescription">Open Graph Description (optional, uses main desc. if empty)</Label>
              <Input id="ogDescription" {...register('ogDescription')} placeholder={descriptionValue || "Same as Main Description"} />
            </div>
            <div>
              <Label htmlFor="ogImage">Open Graph Image URL</Label>
              <Input id="ogImage" {...register('ogImage')} type="url" placeholder="https://example.com/image.jpg" />
              {errors.ogImage && <p className="text-sm text-destructive mt-1">{errors.ogImage.message}</p>}
            </div>
            <div>
              <Label htmlFor="twitterCard">Twitter Card Type</Label>
              <Input id="twitterCard" {...register('twitterCard')} />
            </div>
             <div>
              <Label htmlFor="twitterSite">Twitter Site Handle (e.g., @YourSite)</Label>
              <Input id="twitterSite" {...register('twitterSite')} placeholder="@YourTwitterHandle" />
            </div>
            <div>
              <Label htmlFor="twitterCreator">Twitter Creator Handle (e.g., @AuthorHandle)</Label>
              <Input id="twitterCreator" {...register('twitterCreator')} placeholder="@AuthorTwitterHandle" />
            </div>
          </CardContent>
        </Card>
        
        <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Wand2 className="mr-2 h-4 w-4" /> Generate Meta Tags
        </Button>
      </form>

      {generatedTags && (
        <Card className="mt-6 bg-secondary/50">
          <CardHeader>
            <CardTitle className="flex items-center"><Code2 className="mr-2 h-5 w-5" /> Generated HTML Meta Tags</CardTitle>
            <CardDescription>Copy these tags and paste them into the <code>&lt;head&gt;</code> section of your HTML document.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea value={generatedTags} readOnly rows={10} className="text-sm font-mono bg-background" />
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={handleCopy}>
              <Copy className="mr-2 h-4 w-4" /> Copy Tags
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
