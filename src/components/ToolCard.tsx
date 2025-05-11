import type { Tool } from '@/types';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

interface ToolCardProps {
  tool: Tool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  const IconComponent = tool.icon;

  return (
    <Link href={`/tools/${tool.slug}`} className="group block h-full">
      <Card className="h-full flex flex-col hover:shadow-xl transition-shadow duration-300 ease-in-out border-border hover:border-primary/50 transform hover:-translate-y-1">
        <CardHeader className="flex flex-row items-start space-x-4 pb-4">
          {IconComponent && (
            <div className="p-3 bg-primary/10 rounded-lg">
              <IconComponent className="h-6 w-6 text-primary" />
            </div>
          )}
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold leading-tight group-hover:text-primary transition-colors">
              {tool.name}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col justify-between">
          <CardDescription className="text-sm text-muted-foreground mb-4 flex-grow">
            {tool.description}
          </CardDescription>
          <Button variant="ghost" size="sm" className="w-full justify-start text-primary p-0 h-auto hover:bg-transparent">
            Use Tool <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}
