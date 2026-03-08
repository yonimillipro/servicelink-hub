import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SearchBar } from "@/components/search/SearchBar";
import { ServiceCard } from "@/components/service/ServiceCard";
import { ServiceCardSkeleton } from "@/components/service/ServiceCardSkeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { StaggerGrid, MotionCard, motion } from "@/components/ui/motion";
import { useSearchServices } from "@/hooks/useServices";
import { Search, SearchX } from "lucide-react";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get("q") || "";
  const location = searchParams.get("location") || "";
  const hasSearched = !!(query || location);

  const { data: result, isLoading } = useSearchServices({
    query: query || undefined,
    location: location || undefined,
  });
  const services = result?.data;
  const totalCount = result?.count ?? 0;

  const handleSearch = (q: string, loc: string) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (loc) params.set("location", loc);
    setSearchParams(params);
  };

  return (
    <Layout>
      <section className="border-b bg-card py-6 sm:py-8 md:py-12">
        <div className="container-padded">
          <h1 className="text-foreground">Search Services</h1>
          <p className="mt-1.5 text-sm text-muted-foreground sm:text-base">Find the right service provider for your needs</p>
          <div className="mt-4 sm:mt-6">
            <SearchBar onSearch={handleSearch} defaultQuery={query} defaultLocation={location} />
          </div>
        </div>
      </section>

      <section className="py-6 sm:py-8">
        <div className="container-padded">
          {!hasSearched ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-16 text-center sm:py-20"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Search className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <p className="mt-4 text-base text-muted-foreground sm:text-lg">Enter a search term to find services</p>
            </motion.div>
          ) : isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <ServiceCardSkeleton key={i} />
              ))}
            </div>
          ) : services && services.length > 0 ? (
            <>
              <p className="mb-4 text-xs text-muted-foreground sm:text-sm">
                {totalCount} result{totalCount !== 1 ? "s" : ""} found
              </p>
              <StaggerGrid className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
                {services.map((service) => (
                  <MotionCard key={service.id}>
                    <ServiceCard service={service} />
                  </MotionCard>
                ))}
              </StaggerGrid>
            </>
          ) : (
            <EmptyState
              icon={SearchX}
              title="No services found"
              description="Try another keyword or adjust your location filter."
            />
          )}
        </div>
      </section>
    </Layout>
  );
}
