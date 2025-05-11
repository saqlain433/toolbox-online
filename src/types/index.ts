import type { LucideIcon } from 'lucide-react';
import type { ComponentType, ReactNode } from 'react';

export interface Tool {
  slug: string;
  name: string;
  description: string;
  longDescription?: string; // For meta description on tool page
  keywords: string[];
  icon?: LucideIcon | ComponentType<{ className?: string }>;
  iconPath?: string; // For custom SVG icons
  category: string; // e.g., "Converters", "Generators", "Calculators"
  component: ComponentType;
  seoImage?: string; // URL for social sharing image
  datePublished?: string; // ISO string
  dateModified?: string; // ISO string
}

export interface ToolCategory {
  name: string;
  tools: Tool[];
}
