"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, LinkIcon, YoutubeIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Thumbnail {
  quality: string;
  url: string;
  width: number;
  height: number;
}

const getYouTubeVideoId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export function YoutubeThumbnailDownloaderTool() {
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnails, setThumbnails] = useState<Thumbnail[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchThumbnails = () => {
    setError(null);
    const videoId = getYouTubeVideoId(videoUrl);
    if (!videoId) {
      setError('Invalid YouTube URL. Please enter a valid video URL.');
      setThumbnails([]);
      return;
    }

    setIsLoading(true);
    const thumbQualities = [
      { quality: 'Max Resolution', file: 'maxresdefault.jpg', width: 1280, height: 720 },
      { quality: 'High Quality (HD)', file: 'sddefault.jpg', width: 640, height: 480 },
      { quality: 'Medium Quality', file: 'hqdefault.jpg', width: 480, height: 360 },
      { quality: 'Standard Quality', file: 'mqdefault.jpg', width: 320, height: 180 },
      { quality: 'Default', file: 'default.jpg', width: 120, height: 90 },
    ];

    const fetchedThumbnails: Thumbnail[] = thumbQualities.map(q => ({
      quality: q.quality,
      url: `https://img.youtube.com/vi/${videoId}/${q.file}`,
      width: q.width,
      height: q.height,
    }));
    
    // Simulate a check for actual existence (in a real scenario, you might ping these URLs)
    // For this client-side version, we'll assume they exist.
    setThumbnails(fetchedThumbnails);
    setIsLoading(false);
    if(fetchedThumbnails.length === 0) {
        setError('Could not fetch thumbnails for this video. It might be private or deleted.');
    }
  };

  const handleDownload = async (url: string, quality: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `youtube_thumbnail_${getYouTubeVideoId(videoUrl)}_${quality.toLowerCase().replace(' ', '_')}.${blob.type.split('/')[1] || 'jpg'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      toast({ title: 'Download Started!', description: `${quality} thumbnail download has begun.` });
    } catch (err) {
      console.error('Download error:', err);
      toast({ title: 'Download Failed', description: 'Could not download the thumbnail. The image might not be available or a network error occurred.', variant: 'destructive' });
    }
  };


  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Enter a YouTube video URL to fetch and download its thumbnails in various qualities.
      </p>
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-grow relative">
          <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            id="youtube-url"
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            className="pl-10"
          />
        </div>
        <Button onClick={fetchThumbnails} disabled={isLoading} className="bg-accent hover:bg-accent/90 text-accent-foreground">
          {isLoading ? 'Fetching...' : <><YoutubeIcon className="mr-2 h-4 w-4" /> Fetch Thumbnails</>}
        </Button>
      </div>

      {error && <p className="text-destructive text-sm">{error}</p>}

      {thumbnails.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {thumbnails.map((thumb) => (
            <Card key={thumb.quality} className="overflow-hidden shadow-md hover:shadow-xl transition-shadow">
              <CardHeader className="p-0">
                <div className="aspect-video relative bg-muted overflow-hidden">
                 <Image
                    src={thumb.url}
                    alt={`${thumb.quality} thumbnail`}
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint="youtube video thumbnail"
                    onError={(e) => {
                      // Handle broken images, e.g., by replacing src or hiding
                      e.currentTarget.src = 'https://picsum.photos/480/360?grayscale'; // Placeholder
                      e.currentTarget.alt = 'Thumbnail not available';
                    }}
                  />
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-lg mb-1">{thumb.quality}</CardTitle>
                <p className="text-xs text-muted-foreground mb-3">{thumb.width} x {thumb.height}</p>
                <Button
                  onClick={() => handleDownload(thumb.url, thumb.quality)}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  <Download className="mr-2 h-4 w-4" /> Download
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
