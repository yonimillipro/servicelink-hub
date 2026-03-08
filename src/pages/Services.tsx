import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ServiceCard } from "@/components/service/ServiceCard";
import { ServiceCardSkeleton } from "@/components/service/ServiceCardSkeleton";
import { SearchBar } from "@/components/search/SearchBar";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { StaggerGrid, MotionCard } from "@/components/ui/motion";
import { FilterPanel } from "@/components/service/FilterPanel";
import { useServices } from "@/hooks/useServices";
import { useCategories } from "@/hooks/useCategories";
import { Grid3X3, List, ChevronLeft, ChevronRight, SlidersHorizontal, PackageSearch } from "lucide-react";

const PAGE_SIZE = 12;

const Services = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("none");
  const [filterOpen, setFilterOpen] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);

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

  let services = result?.data || [];

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
  if (verifiedOnly) {
    services = services.filter(s => s.companies?.verified);
  }

  services = [...services].sort((a, b) => {
    if (a.is_featured && !b.is_featured) return -1;
    if (!a.is_featured && b.is_featured) return 1;
    return 0;
  });

  if (sortBy === "newest") {
    services.sort((a, b) => {
      if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  } else if (sortBy === "oldest") {
    services.sort((a, b) => {
      if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1;
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });
  } else if (sortBy === "price-low") {
    services.sort((a, b) => {
      if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1;
      return (a.price ?? 0) - (b.price ?? 0);
    });
  } else if (sortBy === "price-high") {
    services.sort((a, b) => {
      if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1;
      return (b.price ?? 0) - (a.price ?? 0);
    });
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
    if (value === "all") params.delete("category");
    else params.set("category", value);
    params.delete("page");
    setSearchParams(params);
  };

  const handleResetFilters = () => {
    setSortBy("none");
    setVerifiedOnly(false);
    setMinRating(0);
    handleCategoryChange("all");
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
      {/* Filter Panel */}
      <FilterPanel
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        categories={categories}
        selectedCategory={selectedCategorySlug}
        onCategoryChange={handleCategoryChange}
        sortBy={sortBy}
        onSortChange={setSortBy}
        verifiedOnly={verifiedOnly}
        onVerifiedChange={setVerifiedOnly}
        minRating={minRating}
        onMinRatingChange={setMinRating}
        onReset={handleResetFilters}
      />

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
              <Button variant="outline" className="gap-2" onClick={() => setFilterOpen(true)}>
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
              </Button>
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

      {/* Results */}
      <section className="py-5 sm:py-6 md:py-8">
        <div className="container-padded">
          {isLoading ? (
            <div className={viewMode === "grid" ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6" : "space-y-4"}>
              {Array.from({ length: 6 }).map((_, i) => <ServiceCardSkeleton key={i} />)}
            </div>
          ) : services && services.length > 0 ? (
            <>
              <p className="mb-4 text-xs text-muted-foreground sm:text-sm">
                {totalCount} service{totalCount !== 1 ? "s" : ""} found
                {totalPages > 1 && ` • Page ${currentPage} of ${totalPages}`}
              </p>
              <StaggerGrid className={viewMode === "grid" ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6" : "space-y-4"}>
                {services.map((service) => (
                  <MotionCard key={service.id}>
                    <ServiceCard service={service} />
                  </MotionCard>
                ))}
              </StaggerGrid>
              {renderPagination()}
            </>
          ) : (
            <EmptyState
              icon={PackageSearch}
              title="No services found"
              description="Try adjusting your filters or search terms to find what you're looking for."
              actionLabel="Reset Filters"
              onAction={handleResetFilters}
            />
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Services;
