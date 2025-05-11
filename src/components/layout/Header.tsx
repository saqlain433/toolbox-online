"use client";

import Link from 'next/link';
import { LayersIcon } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2" aria-label="Toolbox Online Home">
          <LayersIcon className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-foreground">
            Toolbox <span className="text-primary">Online</span>
          </span>
        </Link>
        <div className="flex items-center space-x-4">
          {/* Future navigation links can go here */}
          {/* Example: 
          <Button variant="ghost" asChild>
            <Link href="/about">About</Link>
          </Button> 
          */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
