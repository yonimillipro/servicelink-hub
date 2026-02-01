import { Search, MapPin, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface SearchBarProps {
  onSearch?: (query: string, location: string) => void;
  placeholder?: string;
  showFilters?: boolean;
  className?: string;
  defaultQuery?: string;
  defaultLocation?: string;
}

export function SearchBar({ 
  onSearch, 
  placeholder = "What service are you looking for?",
  showFilters = true,
  className,
  defaultQuery = "",
  defaultLocation = ""
}: SearchBarProps) {
  const [query, setQuery] = useState(defaultQuery);
  const [location, setLocation] = useState(defaultLocation);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(query, location);
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="flex flex-col gap-2 sm:flex-row sm:gap-0">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-12 rounded-lg border-border bg-card pl-12 pr-4 text-foreground placeholder:text-muted-foreground sm:rounded-r-none sm:border-r-0"
          />
        </div>
        <div className="relative flex-1 sm:max-w-[200px]">
          <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="h-12 rounded-lg border-border bg-card pl-12 pr-4 text-foreground placeholder:text-muted-foreground sm:rounded-none sm:border-r-0"
          />
        </div>
        <div className="flex gap-2">
          {showFilters && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-12 w-12 shrink-0 rounded-lg sm:rounded-l-none sm:rounded-r-none sm:border-r-0"
            >
              <SlidersHorizontal className="h-5 w-5" />
            </Button>
          )}
          <Button type="submit" className="h-12 flex-1 rounded-lg px-6 sm:flex-initial sm:rounded-l-none">
            Search
          </Button>
        </div>
      </div>
    </form>
  );
}
