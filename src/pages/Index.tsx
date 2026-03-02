import { Layout } from "@/components/layout/Layout";
import { SearchBar } from "@/components/search/SearchBar";
import { ServiceCard } from "@/components/service/ServiceCard";
import { CategoryCard } from "@/components/category/CategoryCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useServices } from "@/hooks/useServices";
import { useCategories } from "@/hooks/useCategories";
import { useAuth } from "@/hooks/useAuth";
import { ArrowRight, Shield, Clock, Users, Star } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const stats = [
  { icon: Users, label: "Active Providers", value: "2,500+" },
  { icon: Star, label: "Happy Customers", value: "15,000+" },
  { icon: Shield, label: "Verified Services", value: "1,200+" },
  { icon: Clock, label: "Quick Response", value: "< 2hrs" },
];

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAdmin, isProvider } = useAuth();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: featuredResult, isLoading: featuredLoading } = useServices({ featured: true, limit: 6 });
  const featuredServices = featuredResult?.data;
  const { data: recentResult, isLoading: recentLoading } = useServices({ limit: 6 });
  const recentServices = recentResult?.data;

  const handleSearch = (query: string, location: string) => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (location) params.set("location", location);
    navigate(`/services?${params.toString()}`);
  };

  const handleBeFirstToPost = () => {
    if (!user) { navigate("/register"); return; }
    if (isAdmin) { navigate("/admin/services"); return; }
    if (isProvider) { navigate("/dashboard/services/add"); return; }
    toast({ title: "Provider Account Required", description: "Switch to a provider account to post services." });
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="hero-gradient relative overflow-hidden py-16 sm:py-20 md:py-28">
        <div className="container-padded relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-white animate-fade-in">
              Find Trusted Services
              <br />
              <span className="text-white/80">Near You</span>
            </h1>
            <p className="mt-4 text-base text-white/70 sm:text-lg md:text-xl animate-slide-up max-w-2xl mx-auto">
              Connect with verified professionals and businesses. From home repairs to digital services, find the right expert for any job.
            </p>
            <div className="mt-8 sm:mt-10 animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <SearchBar className="mx-auto max-w-2xl" onSearch={handleSearch} />
            </div>
          </div>
        </div>
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-white/5" />
      </section>

      {/* Stats */}
      <section className="border-b bg-card py-6 sm:py-8">
        <div className="container-padded">
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="mx-auto h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                <p className="mt-1.5 text-xl font-bold text-foreground sm:text-2xl">{stat.value}</p>
                <p className="text-xs text-muted-foreground sm:text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-10 sm:py-12 md:py-16">
        <div className="container-padded">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-foreground">Browse Categories</h2>
              <p className="mt-1 text-sm text-muted-foreground sm:text-base">Find services by category</p>
            </div>
            <Link to="/categories">
              <Button variant="ghost" className="gap-1.5 text-sm">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="mt-6 sm:mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 sm:gap-4">
            {categoriesLoading
              ? Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)
              : categories?.slice(0, 8).map((category) => (
                  <CategoryCard key={category.id} category={category} variant="compact" />
                ))
            }
          </div>
        </div>
      </section>

      {/* Featured Services */}
      {(featuredLoading || (featuredServices && featuredServices.length > 0)) && (
        <section className="bg-secondary/40 py-10 sm:py-12 md:py-16">
          <div className="container-padded">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-foreground">Featured Services</h2>
                <p className="mt-1 text-sm text-muted-foreground sm:text-base">Hand-picked services from top providers</p>
              </div>
              <Link to="/services?featured=true">
                <Button variant="ghost" className="gap-1.5 text-sm">
                  View All <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="mt-6 sm:mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
              {featuredLoading
                ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-80 rounded-xl" />)
                : featuredServices?.map((service) => <ServiceCard key={service.id} service={service} />)
              }
            </div>
          </div>
        </section>
      )}

      {/* Recent Listings */}
      <section className="py-10 sm:py-12 md:py-16">
        <div className="container-padded">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-foreground">Recent Listings</h2>
              <p className="mt-1 text-sm text-muted-foreground sm:text-base">Latest services added to the platform</p>
            </div>
            <Link to="/services">
              <Button variant="ghost" className="gap-1.5 text-sm">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="mt-6 sm:mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
            {recentLoading
              ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-80 rounded-xl" />)
              : recentServices && recentServices.length > 0
                ? recentServices.map((service) => <ServiceCard key={service.id} service={service} />)
                : (
                    <div className="col-span-full rounded-xl border border-dashed border-border py-12 text-center">
                      <p className="text-muted-foreground">No services available yet.</p>
                      <Button className="mt-4" onClick={handleBeFirstToPost}>Be the first to post</Button>
                    </div>
                  )
            }
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="hero-gradient py-14 sm:py-16 md:py-20">
        <div className="container-padded text-center">
          <h2 className="text-white">Ready to Offer Your Services?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-white/70 sm:text-lg">
            Join thousands of businesses and freelancers growing their customer base with ServiceLink.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link to="/register">
              <Button size="lg" variant="secondary" className="min-w-[180px] sm:min-w-[200px]">
                Get Started Free
              </Button>
            </Link>
            <Link to="/services">
              <Button size="lg" variant="outline" className="min-w-[180px] sm:min-w-[200px] border-white/30 text-white hover:bg-white/10">
                Browse Services
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
