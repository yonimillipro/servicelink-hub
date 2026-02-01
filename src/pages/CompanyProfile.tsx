import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ServiceCard } from "@/components/service/ServiceCard";
import { mockCompanies, mockServices } from "@/data/mockData";
import {
  MapPin,
  Star,
  Phone,
  Mail,
  Globe,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  Share2,
} from "lucide-react";

const CompanyProfile = () => {
  const { id } = useParams();
  const company = mockCompanies.find((c) => c.id === id);
  const companyServices = mockServices.filter((s) => s.companyId === id);

  if (!company) {
    return (
      <Layout>
        <div className="container-padded flex min-h-[50vh] flex-col items-center justify-center">
          <h2 className="text-foreground">Company Not Found</h2>
          <p className="mt-2 text-muted-foreground">
            The company you're looking for doesn't exist.
          </p>
          <Link to="/services">
            <Button className="mt-4">Browse Services</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="border-b bg-card">
        <div className="container-padded py-4">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Services
          </Link>
        </div>
      </div>

      {/* Company Header */}
      <section className="border-b bg-card py-8 md:py-12">
        <div className="container-padded">
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
            <img
              src={company.logo}
              alt={company.name}
              className="h-24 w-24 rounded-2xl object-cover shadow-md md:h-32 md:w-32"
            />
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-foreground">{company.name}</h1>
                {company.verified && (
                  <span className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                    <CheckCircle2 className="h-4 w-4" />
                    Verified
                  </span>
                )}
              </div>
              <p className="mt-2 max-w-2xl text-muted-foreground">
                {company.description}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {company.location}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-warning text-warning" />
                  {company.rating} ({company.reviewCount} reviews)
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Member since {new Date(company.createdAt).getFullYear()}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
              <a href={`tel:${company.phone}`}>
                <Button className="gap-2">
                  <Phone className="h-4 w-4" />
                  Contact
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="container-padded py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Services */}
          <div className="lg:col-span-2">
            <h3 className="text-foreground">
              Services ({companyServices.length})
            </h3>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {companyServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
            {companyServices.length === 0 && (
              <div className="rounded-xl bg-secondary/50 py-12 text-center">
                <p className="text-muted-foreground">
                  No services listed yet.
                </p>
              </div>
            )}
          </div>

          {/* Contact Info */}
          <div>
            <div className="sticky top-24 rounded-xl bg-card p-6 shadow-card">
              <h4 className="font-semibold text-foreground">
                Contact Information
              </h4>
              <div className="mt-4 space-y-4">
                <a
                  href={`tel:${company.phone}`}
                  className="flex items-center gap-3 rounded-lg bg-secondary p-3 text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  <Phone className="h-5 w-5" />
                  <div>
                    <p className="text-xs text-muted-foreground group-hover:text-inherit">
                      Phone
                    </p>
                    <p className="font-medium">{company.phone}</p>
                  </div>
                </a>
                <a
                  href={`mailto:${company.email}`}
                  className="flex items-center gap-3 rounded-lg bg-secondary p-3 text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  <Mail className="h-5 w-5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-medium">{company.email}</p>
                  </div>
                </a>
                <div className="flex items-center gap-3 rounded-lg bg-secondary p-3">
                  <MapPin className="h-5 w-5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="font-medium text-foreground">
                      {company.location}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CompanyProfile;
