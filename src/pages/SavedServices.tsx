import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ServiceCard } from "@/components/service/ServiceCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useSavedServices } from "@/hooks/useSavedServices";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ServiceWithRelations } from "@/hooks/useServices";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SavedServices() {
  const { user } = useAuth();
  const { data: savedIds, isLoading: savedLoading } = useSavedServices();

  const { data: services, isLoading: servicesLoading } = useQuery({
    queryKey: ["saved-services-full", savedIds],
    queryFn: async (): Promise<ServiceWithRelations[]> => {
      if (!savedIds || savedIds.length === 0) return [];
      const { data, error } = await supabase
        .from("services")
        .select("*, categories(name, slug), companies(id, name, logo_url, location, verified)")
        .in("id", savedIds);
      if (error) throw error;
      return (data || []) as ServiceWithRelations[];
    },
    enabled: !!savedIds && savedIds.length > 0,
  });

  const isLoading = savedLoading || servicesLoading;
  const hasServices = services && services.length > 0;

  return (
    <Layout>
      <section className="border-b bg-card py-6 sm:py-8">
        <div className="container-padded">
          <div className="flex items-center gap-3">
            <Heart className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-foreground sm:text-2xl">Saved Services</h1>
              <p className="mt-1 text-sm text-muted-foreground">Services you've bookmarked for later</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-6 sm:py-8">
        <div className="container-padded">
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-72 rounded-xl sm:h-80" />
              ))}
            </div>
          ) : hasServices ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center sm:py-20">
              <Heart className="mx-auto h-12 w-12 text-muted-foreground/30" />
              <p className="mt-3 text-base text-muted-foreground sm:text-lg">No saved services yet</p>
              <p className="mt-1 text-sm text-muted-foreground">Click the heart icon on any service to save it</p>
              <Link to="/services">
                <Button className="mt-4">Browse Services</Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
