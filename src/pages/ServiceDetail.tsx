import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { mockServices, mockCompanies } from "@/data/mockData";
import {
  MapPin,
  Star,
  Clock,
  Phone,
  Mail,
  MessageCircle,
  Share2,
  Heart,
  ChevronLeft,
  CheckCircle2,
  Building2,
} from "lucide-react";
import { useState } from "react";
import { ServiceCard } from "@/components/service/ServiceCard";

const ServiceDetail = () => {
  const { id } = useParams();
  const [inquiryForm, setInquiryForm] = useState({
    name: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const service = mockServices.find((s) => s.id === id);
  const company = mockCompanies.find((c) => c.id === service?.companyId);
  const relatedServices = mockServices
    .filter((s) => s.categorySlug === service?.categorySlug && s.id !== id)
    .slice(0, 3);

  if (!service) {
    return (
      <Layout>
        <div className="container-padded flex min-h-[50vh] flex-col items-center justify-center">
          <h2 className="text-foreground">Service Not Found</h2>
          <p className="mt-2 text-muted-foreground">
            The service you're looking for doesn't exist.
          </p>
          <Link to="/services">
            <Button className="mt-4">Browse Services</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const formatPrice = (price: number, type: string) => {
    const formatted = new Intl.NumberFormat("en-ET", {
      style: "currency",
      currency: "ETB",
      minimumFractionDigits: 0,
    }).format(price);

    switch (type) {
      case "starting_from":
        return `From ${formatted}`;
      case "negotiable":
        return "Price Negotiable";
      default:
        return formatted;
    }
  };

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

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

      <div className="container-padded py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image */}
            <div className="relative aspect-video overflow-hidden rounded-xl bg-secondary">
              <img
                src={service.image}
                alt={service.title}
                className="h-full w-full object-cover"
              />
              {service.isFeatured && (
                <div className="featured-badge">
                  <Star className="h-3 w-3 fill-current" />
                  Featured
                </div>
              )}
            </div>

            {/* Title & Meta */}
            <div className="mt-6">
              <Badge variant="secondary">{service.category}</Badge>
              <h1 className="mt-3 text-foreground">{service.title}</h1>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {service.location}
                </span>
                {service.reviewCount > 0 && (
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-warning text-warning" />
                    {service.rating.toFixed(1)} ({service.reviewCount} reviews)
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Posted {new Date(service.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="mt-6 rounded-xl bg-primary/5 p-6">
              <p className="text-sm font-medium text-muted-foreground">Price</p>
              <p className="mt-1 text-3xl font-bold text-primary">
                {formatPrice(service.price, service.priceType)}
              </p>
            </div>

            {/* Description */}
            <div className="mt-8">
              <h3 className="text-foreground">About This Service</h3>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                {service.description}
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Button variant="outline" className="gap-2">
                <Heart className="h-4 w-4" />
                Save
              </Button>
              <Button variant="outline" className="gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Card */}
            {company && (
              <div className="rounded-xl bg-card p-6 shadow-card">
                <div className="flex items-center gap-4">
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="h-16 w-16 rounded-xl object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-foreground">
                        {company.name}
                      </h4>
                      {company.verified && (
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {company.serviceCount} services
                    </p>
                  </div>
                </div>
                <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {company.location}
                  </p>
                  <p className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-warning text-warning" />
                    {company.rating} rating ({company.reviewCount} reviews)
                  </p>
                </div>
                <Link to={`/companies/${company.id}`}>
                  <Button variant="outline" className="mt-4 w-full gap-2">
                    <Building2 className="h-4 w-4" />
                    View Profile
                  </Button>
                </Link>
              </div>
            )}

            {/* Contact Form */}
            <div className="rounded-xl bg-card p-6 shadow-card">
              <h4 className="font-semibold text-foreground">
                Contact Provider
              </h4>
              {isSubmitted ? (
                <div className="mt-4 rounded-lg bg-success/10 p-4 text-center">
                  <CheckCircle2 className="mx-auto h-8 w-8 text-success" />
                  <p className="mt-2 font-medium text-success">
                    Inquiry Sent!
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    The provider will contact you soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitInquiry} className="mt-4 space-y-4">
                  <div>
                    <Input
                      placeholder="Your Name"
                      value={inquiryForm.name}
                      onChange={(e) =>
                        setInquiryForm({ ...inquiryForm, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Phone Number"
                      type="tel"
                      value={inquiryForm.phone}
                      onChange={(e) =>
                        setInquiryForm({ ...inquiryForm, phone: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Textarea
                      placeholder="Your message..."
                      rows={4}
                      value={inquiryForm.message}
                      onChange={(e) =>
                        setInquiryForm({
                          ...inquiryForm,
                          message: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full gap-2"
                    disabled={isSubmitting}
                  >
                    <MessageCircle className="h-4 w-4" />
                    {isSubmitting ? "Sending..." : "Send Inquiry"}
                  </Button>
                </form>
              )}
            </div>

            {/* Quick Contact */}
            {company && (
              <div className="rounded-xl bg-card p-6 shadow-card">
                <h4 className="font-semibold text-foreground">Quick Contact</h4>
                <div className="mt-4 space-y-3">
                  <a
                    href={`tel:${company.phone}`}
                    className="flex items-center gap-3 rounded-lg bg-secondary p-3 text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    <Phone className="h-5 w-5" />
                    <span className="text-sm font-medium">Call Now</span>
                  </a>
                  <a
                    href={`mailto:${company.email}`}
                    className="flex items-center gap-3 rounded-lg bg-secondary p-3 text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    <Mail className="h-5 w-5" />
                    <span className="text-sm font-medium">Send Email</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Services */}
        {relatedServices.length > 0 && (
          <section className="mt-16">
            <h3 className="text-foreground">Related Services</h3>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedServices.map((relService) => (
                <ServiceCard key={relService.id} service={relService} />
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
};

export default ServiceDetail;
