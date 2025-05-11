
import { getToolsByCategory, allTools, type Tool } from '@/lib/tools';
import ToolCard from '@/components/ToolCard';
import type { Metadata } from 'next';
import SearchBar from '@/components/SearchBar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { SearchX } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Toolbox Online - Your Ultimate Collection of Online Tools',
  description: 'Explore a vast collection of over 50 free online tools designed to simplify your tasks. From converters and calculators to generators and formatters, Toolbox Online has you covered.',
};

interface HomePageProps {
  searchParams?: {
    q?: string;
  };
}

// Helper function to group tools by category
const groupToolsByCategory = (tools: Tool[]): Record<string, Tool[]> => {
  return tools.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = [];
    }
    acc[tool.category].push(tool);
    // Sort tools alphabetically within each category
    acc[tool.category].sort((a, b) => a.name.localeCompare(b.name));
    return acc;
  }, {} as Record<string, Tool[]>);
};


export default function HomePage({ searchParams }: HomePageProps) {
  const searchTerm = searchParams?.q?.toLowerCase() || '';
  let displayedTools = allTools;

  if (searchTerm) {
    displayedTools = allTools.filter(tool => {
      const searchableContent = [
        tool.name.toLowerCase(),
        tool.description.toLowerCase(),
        tool.longDescription?.toLowerCase() || '',
        ...tool.keywords.map(k => k.toLowerCase())
      ].join(' ');
      return searchableContent.includes(searchTerm);
    });
  }
  
  const toolsByCat = groupToolsByCategory(displayedTools);

  // Custom sorting for categories
  const categoryOrderFirst = ["Converters"];
  const categoryOrderLast = ["AI Tools"];
  
  const allCategoryNames = Object.keys(toolsByCat);

  const firstCategories = categoryOrderFirst.filter(cat => allCategoryNames.includes(cat));
  
  const lastCategories = categoryOrderLast.filter(cat => allCategoryNames.includes(cat));
  
  const middleCategories = allCategoryNames
    .filter(cat => !firstCategories.includes(cat) && !lastCategories.includes(cat))
    .sort((a, b) => a.localeCompare(b));

  const sortedCategories = [...firstCategories, ...middleCategories, ...lastCategories];

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
        <SearchBar />
      </section>

      {searchTerm && displayedTools.length === 0 && (
        <Alert variant="default" className="bg-secondary/30">
          <SearchX className="h-5 w-5" />
          <AlertTitle>No Tools Found</AlertTitle>
          <AlertDescription>
            Sorry, no tools matched your search criteria for "{searchParams?.q}". Try a different search term.
          </AlertDescription>
        </Alert>
      )}

      {sortedCategories.map((category) => {
        if (toolsByCat[category] && toolsByCat[category].length > 0) {
          return (
            <section key={category} className="mb-12">
              <h2 className="text-3xl font-semibold mb-6 pb-2 border-b border-primary/30 text-foreground">
                {category}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {toolsByCat[category]?.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            </section>
          );
        }
        return null;
      })}
    </div>
  );
}
