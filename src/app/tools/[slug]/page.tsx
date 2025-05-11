import { getToolBySlug, allTools } from '@/lib/tools';
import { notFound } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface ToolPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return allTools.map((tool) => ({
    slug: tool.slug,
  }));
}

export async function generateMetadata(
  { params }: ToolPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const tool = getToolBySlug(params.slug);

  if (!tool) {
    return {
      title: 'Tool Not Found',
    };
  }

  const previousImages = (await parent).openGraph?.images || [];
  const seoImage = tool.seoImage || 'https://picsum.photos/1200/630?random=tool'; // Default SEO image

  return {
    title: `${tool.name} - Toolbox Online`,
    description: tool.longDescription || tool.description,
    keywords: tool.keywords.join(', '),
    openGraph: {
      title: `${tool.name} - Toolbox Online`,
      description: tool.longDescription || tool.description,
      url: `https://yourdomain.com/tools/${tool.slug}`, // Replace with your actual domain
      siteName: 'Toolbox Online',
      images: [
        {
          url: seoImage,
          width: 1200,
          height: 630,
          alt: `${tool.name} tool image`,
        },
        ...previousImages,
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${tool.name} - Toolbox Online`,
      description: tool.longDescription || tool.description,
      images: [seoImage],
    },
    alternates: {
      canonical: `/tools/${tool.slug}`,
    },
  };
}

export default function ToolPage({ params }: ToolPageProps) {
  const tool = getToolBySlug(params.slug);

  if (!tool) {
    notFound();
  }

  const ToolComponent = tool.component;

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader className="border-b">
          <div className="flex items-center space-x-3">
            {tool.icon && <tool.icon className="h-8 w-8 text-primary" />}
            <CardTitle className="text-3xl font-bold text-foreground">{tool.name}</CardTitle>
          </div>
          {tool.longDescription && (
            <CardDescription className="pt-2 text-md text-muted-foreground">
              {tool.longDescription}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="p-6">
          <ToolComponent />
        </CardContent>
      </Card>
    </div>
  );
}
