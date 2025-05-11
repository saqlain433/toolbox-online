
import { getToolsByCategory } from '@/lib/tools';
import ToolCard from '@/components/ToolCard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Toolbox Online - Your Ultimate Collection of Online Tools',
  description: 'Explore a vast collection of over 50 free online tools designed to simplify your tasks. From converters and calculators to generators and formatters, Toolbox Online has you covered.',
};

export default function HomePage() {
  const toolsByCat = getToolsByCategory();

  // Get category names and sort them alphabetically
  const sortedCategories = Object.keys(toolsByCat).sort((a, b) => a.localeCompare(b));

  return (
    <div className="space-y-12">
      <section className="text-center py-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          Welcome to Toolbox Online
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Your one-stop destination for a comprehensive suite of free online tools.
          Boost your productivity with our versatile collection.
        </p>
      </section>

      {sortedCategories.map((category) => (
        <section key={category} className="mb-12">
          <h2 className="text-3xl font-semibold mb-6 pb-2 border-b border-primary/30 text-foreground">
            {category}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {toolsByCat[category].map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

