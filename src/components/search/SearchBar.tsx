import { Search, MapPin } from "lucide-react";
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
  className,
  defaultQuery = "",
  defaultLocation = "",
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
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground sm:h-5 sm:w-5" />
          <Input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-11 rounded-lg border-border bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground sm:h-12 sm:pl-12 sm:rounded-r-none sm:border-r-0 sm:text-base"
          />
        </div>
        <div className="relative flex-1 sm:max-w-[200px]">
          <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground sm:h-5 sm:w-5" />
          <Input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="h-11 rounded-lg border-border bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground sm:h-12 sm:pl-12 sm:rounded-none sm:border-r-0 sm:text-base"
          />
        </div>
        <Button type="submit" className="h-11 flex-1 rounded-lg px-6 sm:h-12 sm:flex-initial sm:rounded-l-none">
          Search
        </Button>
      </div>
    </form>
  );
}
