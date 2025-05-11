import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import Header from '@/components/layout/Header';
import { Toaster } from "@/components/ui/toaster";

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-roboto', // if you wish to use it as a CSS variable
});

export const metadata: Metadata = {
  title: {
    default: 'Toolbox Online - Your Ultimate Collection of Online Tools',
    template: '%s - Toolbox Online',
  },
  description: 'Discover a comprehensive suite of 50+ free online tools, including converters, calculators, generators, and more. Boost your productivity with Toolbox Online.',
  keywords: ['online tools', 'free tools', 'converter', 'calculator', 'generator', 'developer tools', 'productivity tools'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${roboto.className} antialiased flex flex-col min-h-screen`}>
        <Providers>
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          <Toaster />
          {/* Consider adding a Footer component here */}
        </Providers>
      </body>
    </html>
  );
}
