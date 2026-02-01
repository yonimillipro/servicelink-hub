import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { SearchBar } from "@/components/search/SearchBar";
import { ServiceCard } from "@/components/service/ServiceCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockServices, mockCategories } from "@/data/mockData";
import { Grid3X3, List, X } from "lucide-react";
import { cn } from "@/lib/utils";

const priceTypes = [
  { value: "all", label: "All Prices" },
  { value: "fixed", label: "Fixed Price" },
  { value: "starting_from", label: "Starting From" },
  { value: "negotiable", label: "Negotiable" },
];

const Services = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPriceType, setSelectedPriceType] = useState("all");

  const filteredServices = mockServices.filter((service) => {
    if (selectedCategory && service.categorySlug !== selectedCategory) return false;
    if (selectedPriceType !== "all" && service.priceType !== selectedPriceType) return false;
    return true;
  });

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedPriceType("all");
  };

  const hasActiveFilters = selectedCategory || selectedPriceType !== "all";

  return (
    <Layout>
      {/* Header */}
      <section className="border-b bg-card py-8">
        <div className="container-padded">
          <h1 className="text-foreground">All Services</h1>
          <p className="mt-2 text-muted-foreground">
            Browse {filteredServices.length} services available in your area
          </p>
          <div className="mt-6">
            <SearchBar showFilters={false} />
          </div>
        </div>
      </section>

      <div className="container-padded py-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 lg:shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Categories */}
              <div className="rounded-xl bg-card p-4 shadow-sm">
                <h4 className="font-semibold text-foreground">Categories</h4>
                <div className="mt-4 space-y-2">
                  {mockCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() =>
                        setSelectedCategory(
                          selectedCategory === category.slug ? null : category.slug
                        )
                      }
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                        selectedCategory === category.slug
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-secondary"
                      )}
                    >
                      <span>{category.name}</span>
                      <span
                        className={cn(
                          "text-xs",
                          selectedCategory === category.slug
                            ? "text-primary-foreground/80"
                            : "text-muted-foreground"
                        )}
                      >
                        {category.serviceCount}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Type */}
              <div className="rounded-xl bg-card p-4 shadow-sm">
                <h4 className="font-semibold text-foreground">Price Type</h4>
                <div className="mt-4 space-y-2">
                  {priceTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setSelectedPriceType(type.value)}
                      className={cn(
                        "flex w-full items-center rounded-lg px-3 py-2 text-sm transition-colors",
                        selectedPriceType === type.value
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-secondary"
                      )}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                {hasActiveFilters && (
                  <>
                    {selectedCategory && (
                      <Badge variant="secondary" className="gap-1">
                        {mockCategories.find((c) => c.slug === selectedCategory)?.name}
                        <button onClick={() => setSelectedCategory(null)}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                    {selectedPriceType !== "all" && (
                      <Badge variant="secondary" className="gap-1">
                        {priceTypes.find((t) => t.value === selectedPriceType)?.label}
                        <button onClick={() => setSelectedPriceType("all")}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="text-muted-foreground"
                    >
                      Clear all
                    </Button>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Services Grid */}
            {filteredServices.length > 0 ? (
              <div
                className={cn(
                  "grid gap-6",
                  viewMode === "grid"
                    ? "sm:grid-cols-2 xl:grid-cols-3"
                    : "grid-cols-1"
                )}
              >
                {filteredServices.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl bg-card py-16 text-center">
                <p className="text-lg font-medium text-foreground">
                  No services found
                </p>
                <p className="mt-1 text-muted-foreground">
                  Try adjusting your filters or search terms
                </p>
                <Button onClick={clearFilters} className="mt-4">
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Services;
