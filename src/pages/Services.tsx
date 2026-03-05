import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ServiceCard } from "@/components/service/ServiceCard";
import { SearchBar } from "@/components/search/SearchBar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useServices } from "@/hooks/useServices";
import { useCategories } from "@/hooks/useCategories";
import { Grid3X3, List, ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 12;

const Services = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("none");

  const currentPage = Number(searchParams.get("page") || "1");
  const searchQuery = searchParams.get("q") || "";
  const searchLocation = searchParams.get("location") || "";
  const selectedCategorySlug = searchParams.get("category") || "";

  const { data: categories } = useCategories();
  const selectedCategory = categories?.find((c) => c.slug === selectedCategorySlug) || null;

  const { data: result, isLoading } = useServices({
    categorySlug: selectedCategorySlug || undefined,
    featured: searchParams.get("featured") === "true" || undefined,
    page: currentPage,
    pageSize: PAGE_SIZE,
  });

  // Get services and apply client-side sorting + search filtering
  let services = result?.data || [];

  // Client-side search filtering
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    services = services.filter(s =>
      s.title.toLowerCase().includes(q) ||
      (s.description && s.description.toLowerCase().includes(q))
    );
  }
  if (searchLocation) {
    const loc = searchLocation.toLowerCase();
    services = services.filter(s =>
      s.location && s.location.toLowerCase().includes(loc)
    );
  }

  // Client-side sorting
  if (sortBy === "newest") {
    services = [...services].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  } else if (sortBy === "oldest") {
    services = [...services].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  } else if (sortBy === "price-low") {
    services = [...services].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
  } else if (sortBy === "price-high") {
    services = [...services].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
  }

  const totalPages = result?.totalPages ?? 1;
  const totalCount = result?.count ?? 0;

  const handleSearch = (query: string, location: string) => {
    const params = new URLSearchParams(searchParams);
    if (query) params.set("q", query); else params.delete("q");
    if (location) params.set("location", location); else params.delete("location");
    params.delete("page");
    setSearchParams(params);
  };

  const handleCategoryChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === "all") {
      params.delete("category");
    } else {
      params.set("category", value);
    }
    params.delete("page");
    setSearchParams(params);
  };

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    if (page <= 1) params.delete("page"); else params.set("page", String(page));
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const pages: (number | "ellipsis")[] = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) pages.push(i);
      else if (pages[pages.length - 1] !== "ellipsis") pages.push("ellipsis");
    }
    return (
      <nav aria-label="pagination" className="mt-8 flex flex-wrap items-center justify-center gap-1">
        <Button variant="outline" size="sm" className="gap-1" disabled={currentPage <= 1} onClick={() => goToPage(currentPage - 1)}>
          <ChevronLeft className="h-4 w-4" /> <span className="hidden sm:inline">Previous</span>
        </Button>
        {pages.map((p, i) =>
          p === "ellipsis" ? (
            <span key={`e-${i}`} className="px-2 text-muted-foreground">…</span>
          ) : (
            <Button key={p} variant={p === currentPage ? "default" : "outline"} size="icon" className="h-8 w-8 sm:h-9 sm:w-9" onClick={() => goToPage(p)}>
              {p}
            </Button>
          )
        )}
        <Button variant="outline" size="sm" className="gap-1" disabled={currentPage >= totalPages} onClick={() => goToPage(currentPage + 1)}>
          <span className="hidden sm:inline">Next</span> <ChevronRight className="h-4 w-4" />
        </Button>
      </nav>
    );
  };

  return (
    <Layout>
      {/* Header */}
      <section className="border-b bg-card py-5 sm:py-6 md:py-8">
        <div className="container-padded">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground sm:text-2xl md:text-3xl">
                {selectedCategory ? selectedCategory.name : "All Services"}
              </h1>
              {selectedCategory?.description && <p className="mt-1 text-sm text-muted-foreground">{selectedCategory.description}</p>}
            </div>
            <div className="flex items-center gap-2">
              <Button variant={viewMode === "grid" ? "default" : "outline"} size="icon" className="h-9 w-9" onClick={() => setViewMode("grid")}>
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button variant={viewMode === "list" ? "default" : "outline"} size="icon" className="h-9 w-9" onClick={() => setViewMode("list")}>
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="mt-4">
            <SearchBar onSearch={handleSearch} defaultQuery={searchQuery} defaultLocation={searchLocation} />
          </div>
        </div>
      </section>

      {/* Filters & Results */}
      <section className="py-5 sm:py-6 md:py-8">
        <div className="container-padded">
          <div className="mb-5 flex flex-wrap items-center gap-2 sm:gap-3">
            <Select value={slug || "all"} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-[160px] sm:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.slug}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px] sm:w-[150px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className={viewMode === "grid" ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6" : "space-y-4"}>
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-72 rounded-xl sm:h-80" />)}
            </div>
          ) : services && services.length > 0 ? (
            <>
              <p className="mb-4 text-xs text-muted-foreground sm:text-sm">
                {totalCount} service{totalCount !== 1 ? "s" : ""} found
                {totalPages > 1 && ` • Page ${currentPage} of ${totalPages}`}
              </p>
              <div className={viewMode === "grid" ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6" : "space-y-4"}>
                {services.map((service) => <ServiceCard key={service.id} service={service} />)}
              </div>
              {renderPagination()}
            </>
          ) : (
            <div className="rounded-xl border border-dashed border-border py-12 text-center">
              <p className="text-muted-foreground">No services found. Try adjusting your filters.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Services;
