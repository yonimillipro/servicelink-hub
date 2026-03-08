import { useParams, Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ServiceCard } from "@/components/service/ServiceCard";
import { ServiceCardSkeleton } from "@/components/service/ServiceCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { StaggerGrid, MotionCard, motion } from "@/components/ui/motion";
import { useCompanyById } from "@/hooks/useCompanies";
import { useServices } from "@/hooks/useServices";
import { MapPin, Phone, Mail, Calendar, CheckCircle2, ChevronLeft, Share2, PackageOpen } from "lucide-react";

const CompanyProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: company, isLoading: companyLoading } = useCompanyById(id);
  const { data: companyResult, isLoading: servicesLoading } = useServices({ companyId: id });
  const companyServices = companyResult?.data;

  if (companyLoading) {
    return (
      <Layout>
        <div className="container-padded py-12 space-y-6">
          <Skeleton className="h-5 w-16" />
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
            <Skeleton className="h-24 w-24 rounded-2xl md:h-32 md:w-32" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-full max-w-md" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
            {Array.from({ length: 2 }).map((_, i) => <ServiceCardSkeleton key={i} />)}
          </div>
        </div>
      </Layout>
    );
  }

  if (!company) {
    return (
      <Layout>
        <div className="container-padded flex min-h-[50vh] flex-col items-center justify-center">
          <h2 className="text-foreground">Company Not Found</h2>
          <p className="mt-2 text-muted-foreground">The company you're looking for doesn't exist.</p>
          <Link to="/services">
            <Button className="mt-4">Browse Services</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="border-b bg-card">
        <div className="container-padded py-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>
        </div>
      </div>

      <section className="border-b bg-card py-8 md:py-12">
        <div className="container-padded">
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
            <img
              src={company.logo_url || "/placeholder.svg"}
              alt={company.name}
              className="h-24 w-24 rounded-2xl object-cover shadow-md md:h-32 md:w-32"
            />
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-foreground">{company.name}</h1>
                {company.verified && (
                  <span className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    <CheckCircle2 className="h-4 w-4" />
                    Verified Provider
                  </span>
                )}
              </div>
              <p className="mt-2 max-w-2xl text-muted-foreground">{company.description}</p>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {company.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {company.location}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Member since {new Date(company.created_at).getFullYear()}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
              {company.phone && (
                <a href={`tel:${company.phone}`}>
                  <Button className="gap-2">
                    <Phone className="h-4 w-4" />
                    Contact
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="container-padded py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h3 className="text-foreground">Services ({companyServices?.length || 0})</h3>
            {servicesLoading ? (
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                {Array.from({ length: 2 }).map((_, i) => <ServiceCardSkeleton key={i} />)}
              </div>
            ) : companyServices && companyServices.length > 0 ? (
              <StaggerGrid className="mt-6 grid gap-6 sm:grid-cols-2">
                {companyServices.map((service) => (
                  <MotionCard key={service.id}>
                    <ServiceCard service={service} />
                  </MotionCard>
                ))}
              </StaggerGrid>
            ) : (
              <div className="mt-6">
                <EmptyState
                  icon={PackageOpen}
                  title="No services listed yet"
                  description="This provider hasn't added any services."
                />
              </div>
            )}
          </div>

          <div>
            <div className="sticky top-24 rounded-xl bg-card p-6 shadow-card">
              <h4 className="font-semibold text-foreground">Contact Information</h4>
              <div className="mt-4 space-y-4">
                {company.phone && (
                  <a href={`tel:${company.phone}`} className="flex items-center gap-3 rounded-lg bg-secondary p-3 text-foreground transition-colors hover:bg-primary hover:text-primary-foreground">
                    <Phone className="h-5 w-5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="font-medium">{company.phone}</p>
                    </div>
                  </a>
                )}
                {company.email && (
                  <a href={`mailto:${company.email}`} className="flex items-center gap-3 rounded-lg bg-secondary p-3 text-foreground transition-colors hover:bg-primary hover:text-primary-foreground">
                    <Mail className="h-5 w-5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="font-medium">{company.email}</p>
                    </div>
                  </a>
                )}
                {company.location && (
                  <div className="flex items-center gap-3 rounded-lg bg-secondary p-3">
                    <MapPin className="h-5 w-5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="font-medium text-foreground">{company.location}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CompanyProfile;
