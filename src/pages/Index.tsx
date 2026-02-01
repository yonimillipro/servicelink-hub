import { Layout } from "@/components/layout/Layout";
import { SearchBar } from "@/components/search/SearchBar";
import { ServiceCard } from "@/components/service/ServiceCard";
import { CategoryCard } from "@/components/category/CategoryCard";
import { Button } from "@/components/ui/button";
import { mockServices, mockCategories } from "@/data/mockData";
import { ArrowRight, Shield, Clock, Users, Star } from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  { icon: Users, label: "Active Providers", value: "2,500+" },
  { icon: Star, label: "Happy Customers", value: "15,000+" },
  { icon: Shield, label: "Verified Services", value: "1,200+" },
  { icon: Clock, label: "Quick Response", value: "< 2hrs" },
];

const Index = () => {
  const featuredServices = mockServices.filter((s) => s.isFeatured);
  const recentServices = mockServices.slice(0, 6);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="hero-gradient relative overflow-hidden py-16 md:py-24">
        <div className="container-padded relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-white animate-fade-in">
              Find Trusted Services
              <br />
              <span className="text-white/90">Near You</span>
            </h1>
            <p className="mt-4 text-lg text-white/80 md:text-xl animate-slide-up">
              Connect with verified professionals and businesses. From home repairs to digital services, find the right expert for any job.
            </p>
            <div className="mt-8 animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <SearchBar 
                className="mx-auto max-w-2xl"
                onSearch={(query, location) => {
                  console.log("Search:", query, location);
                }}
              />
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-white/5" />
      </section>

      {/* Stats Section */}
      <section className="border-b bg-card py-8">
        <div className="container-padded">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="mx-auto h-8 w-8 text-primary" />
                <p className="mt-2 text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 md:py-16">
        <div className="container-padded">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-foreground">Browse Categories</h2>
              <p className="mt-1 text-muted-foreground">
                Find services by category
              </p>
            </div>
            <Link to="/categories">
              <Button variant="ghost" className="gap-2">
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
            {mockCategories.slice(0, 8).map((category) => (
              <CategoryCard key={category.id} category={category} variant="compact" />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      {featuredServices.length > 0 && (
        <section className="bg-secondary/50 py-12 md:py-16">
          <div className="container-padded">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-foreground">Featured Services</h2>
                <p className="mt-1 text-muted-foreground">
                  Hand-picked services from top providers
                </p>
              </div>
              <Link to="/services?featured=true">
                <Button variant="ghost" className="gap-2">
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Services */}
      <section className="py-12 md:py-16">
        <div className="container-padded">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-foreground">Recent Listings</h2>
              <p className="mt-1 text-muted-foreground">
                Latest services added to the platform
              </p>
            </div>
            <Link to="/services">
              <Button variant="ghost" className="gap-2">
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recentServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16 md:py-20">
        <div className="container-padded text-center">
          <h2 className="text-white">Ready to Offer Your Services?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
            Join thousands of businesses and freelancers who are growing their customer base with Servizi.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/register">
              <Button size="lg" variant="secondary" className="min-w-[200px]">
                Get Started Free
              </Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="outline" className="min-w-[200px] border-white/30 text-white hover:bg-white/10">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
