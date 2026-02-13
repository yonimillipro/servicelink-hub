import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SearchBar } from "@/components/search/SearchBar";
import { ServiceCard } from "@/components/service/ServiceCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchServices } from "@/hooks/useServices";
import { Search } from "lucide-react";

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
      <section className="border-b bg-card py-8 md:py-12">
        <div className="container-padded">
          <h1 className="text-foreground">Search Services</h1>
          <p className="mt-2 text-muted-foreground">Find the right service provider for your needs</p>
          <div className="mt-6">
            <SearchBar
              onSearch={handleSearch}
              defaultQuery={query}
              defaultLocation={location}
            />
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container-padded">
          {!hasSearched ? (
            <div className="py-20 text-center">
              <Search className="mx-auto h-16 w-16 text-muted-foreground/30" />
              <p className="mt-4 text-lg text-muted-foreground">Enter a search term to find services</p>
            </div>
          ) : isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-80 rounded-xl" />
              ))}
            </div>
          ) : services && services.length > 0 ? (
            <>
              <p className="mb-4 text-sm text-muted-foreground">
                {totalCount} result{totalCount !== 1 ? "s" : ""} found
              </p>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {services.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            </>
          ) : (
            <div className="py-20 text-center">
              <p className="text-muted-foreground">No services found for your search.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
