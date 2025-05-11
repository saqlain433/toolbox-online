"use client";

import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";
import { useState, type ChangeEvent, useEffect } from "react";
import { useRouter, useSearchParams } from 'next/navigation';

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSearchTerm = searchParams.get('q') || "";
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

  // Update searchTerm if URL query param changes
  useEffect(() => {
    setSearchTerm(searchParams.get('q') || "");
  }, [searchParams]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // For now, this search bar is presentational.
    // Actual search functionality would require updating state that filters ToolCard components,
    // or redirecting to a search results page.
    // Example: router.push(`/?q=${encodeURIComponent(searchTerm)}`);
    // For this iteration, we'll just log it.
    if (searchTerm.trim()) {
      console.log("Search term submitted:", searchTerm);
      // If you want to update URL for potential filtering later:
      // router.push(`/?q=${encodeURIComponent(searchTerm)}`, { scroll: false });
    } else {
      // router.push(`/`, { scroll: false });
    }
    // We are not implementing filtering logic in this step as it's a larger task.
  };

  return (
    <form onSubmit={handleSearchSubmit} className="relative w-full max-w-xl mx-auto my-8">
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search for tools..."
        className="w-full pl-10 pr-4 py-3 text-base rounded-lg shadow-sm border-border focus:ring-primary focus:border-primary"
        value={searchTerm}
        onChange={handleSearchChange}
        aria-label="Search for tools"
      />
      <button type="submit" className="sr-only">Search</button>
    </form>
  );
}