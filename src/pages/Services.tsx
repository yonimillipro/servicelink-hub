import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ServiceCard } from "@/components/service/ServiceCard";
import { SearchBar } from "@/components/search/SearchBar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSearchServices } from "@/hooks/useServices";
import { useCategories, useCategoryBySlug } from "@/hooks/useCategories";
import { Grid3X3, List, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 12;

const Services = () => {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  const currentPage = Number(searchParams.get("page") || "1");
  const searchQuery = searchParams.get("q") || "";
  const searchLocation = searchParams.get("location") || "";

  const { data: category } = useCategoryBySlug(slug);
  const { data: categories } = useCategories();
  const { data: result, isLoading } = useSearchServices({
    query: searchQuery || undefined,
    location: searchLocation || undefined,
    categorySlug: slug,
    featured: searchParams.get("featured") === "true" || undefined,
    page: currentPage,
    pageSize: PAGE_SIZE,
  });

  const services = result?.data;
  const totalPages = result?.totalPages ?? 1;
  const totalCount = result?.count ?? 0;

  const handleSearch = (query: string, location: string) => {
    const params = new URLSearchParams(searchParams);
    if (query) params.set("q", query);
    else params.delete("q");
    if (location) params.set("location", location);
    else params.delete("location");
    params.delete("page");
    setSearchParams(params);
  };

  const handleCategoryChange = (value: string) => {
    if (value === "all") {
      window.location.href = "/services";
    } else {
      window.location.href = `/categories/${value}`;
    }
  };

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    if (page <= 1) params.delete("page");
    else params.set("page", String(page));
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages: (number | "ellipsis")[] = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "ellipsis") {
        pages.push("ellipsis");
      }
    }

    return (
      <nav aria-label="pagination" className="mt-8 flex items-center justify-center gap-1">
        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          disabled={currentPage <= 1}
          onClick={() => goToPage(currentPage - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        {pages.map((p, i) =>
          p === "ellipsis" ? (
            <span key={`e-${i}`} className="px-2 text-muted-foreground">…</span>
          ) : (
            <Button
              key={p}
              variant={p === currentPage ? "default" : "outline"}
              size="icon"
              className="h-9 w-9"
              onClick={() => goToPage(p)}
            >
              {p}
            </Button>
          )
        )}
        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          disabled={currentPage >= totalPages}
          onClick={() => goToPage(currentPage + 1)}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </nav>
    );
  };

  return (
    <Layout>
      {/* Header */}
      <section className="border-b bg-card py-6 md:py-8">
        <div className="container-padded">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground md:text-3xl">
                {category ? category.name : "All Services"}
              </h1>
              {category?.description && (
                <p className="mt-1 text-muted-foreground">{category.description}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="mt-4">
            <SearchBar 
              onSearch={handleSearch}
              defaultQuery={searchQuery}
              defaultLocation={searchLocation}
            />
          </div>
        </div>
      </section>

      {/* Filters & Results */}
      <section className="py-6 md:py-8">
        <div className="container-padded">
          {/* Filters */}
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <Select value={slug || "all"} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.slug}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select defaultValue="newest">
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              More Filters
            </Button>
          </div>

          {/* Results */}
          {isLoading ? (
            <div className={viewMode === "grid" 
              ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3" 
              : "space-y-4"
            }>
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-80 rounded-xl" />
              ))}
            </div>
          ) : services && services.length > 0 ? (
            <>
              <p className="mb-4 text-sm text-muted-foreground">
                {totalCount} service{totalCount !== 1 ? "s" : ""} found
                {totalPages > 1 && ` • Page ${currentPage} of ${totalPages}`}
              </p>
              <div className={viewMode === "grid" 
                ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3" 
                : "space-y-4"
              }>
                {services.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
              {renderPagination()}
            </>
          ) : (
            <div className="rounded-xl bg-secondary/50 py-12 text-center">
              <p className="text-muted-foreground">
                No services found. Try adjusting your filters.
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Services;
