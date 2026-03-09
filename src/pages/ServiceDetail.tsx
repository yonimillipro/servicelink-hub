import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "@/components/ui/motion";
import { useServiceById } from "@/hooks/useServices";
import { useCreateInquiry } from "@/hooks/useInquiries";
import { useServiceImages } from "@/hooks/useServiceImages";
import { useAuth } from "@/hooks/useAuth";
import { ReviewSection } from "@/components/review/ReviewSection";
import { ImageGallery } from "@/components/service/ImageGallery";
import { MapPin, ChevronLeft, CheckCircle2, Loader2, Mail, PackageSearch } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const inquirySchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: service, isLoading, isError } = useServiceById(id);
  const { data: galleryImages } = useServiceImages(id);
  const createInquiry = useCreateInquiry();
  const { user } = useAuth();

  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const formatPrice = (price: number | null, type: string | null) => {
    if (!price) return "Contact for price";
    const formatted = new Intl.NumberFormat("en-ET", { style: "currency", currency: "ETB", minimumFractionDigits: 0 }).format(price);
    switch (type) {
      case "starting_from": return `From ${formatted}`;
      case "negotiable": return "Negotiable";
      default: return formatted;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = inquirySchema.safeParse(formData);
    if (!validation.success) { toast.error(validation.error.errors[0].message); return; }
    if (!id) return;
    try {
      await createInquiry.mutateAsync({
        service_id: id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        message: formData.message,
        user_id: user?.id ?? null,
      });
      setSubmitted(true);
      toast.success("Inquiry sent successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to send inquiry");
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container-padded py-8">
          <Skeleton className="h-5 w-16 mb-6" />
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="aspect-[16/10] w-full rounded-xl" />
              <Skeleton className="h-5 w-24 rounded-full" />
              <Skeleton className="h-8 w-3/4" />
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-5 w-24 mt-4" />
              <Skeleton className="h-24 w-full" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-32 rounded-xl" />
              <Skeleton className="h-[340px] rounded-xl" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!service || isError) {
    return (
      <Layout>
        <div className="container-padded flex min-h-[50vh] flex-col items-center justify-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <PackageSearch className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-foreground">Service Not Found</h2>
          <p className="mt-2 max-w-md text-muted-foreground">
            This service may have been removed or is currently unavailable.
          </p>
          <div className="mt-6 flex gap-3">
            <Link to="/services"><Button>Browse Services</Button></Link>
            <Button variant="outline" onClick={() => navigate(-1)}>Go Back</Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="border-b bg-card">
        <div className="container-padded py-3 sm:py-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="container-padded py-6 sm:py-8"
      >
        <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <ImageGallery mainImage={service.image} galleryImages={galleryImages || []} />

            <div className="mt-5 sm:mt-6">
              {service.categories && (
                <span className="category-badge bg-primary/10 text-primary">{service.categories.name}</span>
              )}
              <h1 className="mt-2 text-xl font-bold text-foreground sm:text-2xl md:text-3xl">{service.title}</h1>

              {service.companies && (
                <Link to={`/companies/${service.companies.id}`} className="mt-4 flex items-center gap-3 group">
                  <img
                    src={service.companies.logo_url || "/placeholder.svg"}
                    alt={service.companies.name}
                    className="h-10 w-10 rounded-lg object-cover border border-border sm:h-12 sm:w-12"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground group-hover:text-primary transition-colors">{service.companies.name}</span>
                      {service.companies.verified && <CheckCircle2 className="h-4 w-4 text-primary" />}
                    </div>
                    {service.companies.location && (
                      <p className="text-xs text-muted-foreground sm:text-sm">{service.companies.location}</p>
                    )}
                  </div>
              </Link>
              )}

              <div className="mt-6 sm:mt-8">
                <h3 className="text-base font-semibold text-foreground sm:text-lg">Description</h3>
                <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground leading-relaxed sm:text-base">
                  {service.description}
                </p>
              </div>

              {/* Reviews Section */}
              <ReviewSection serviceId={service.id} />
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="sticky top-20 space-y-4 sm:space-y-6">
              {/* Price Card */}
              <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="text-2xl font-bold text-primary sm:text-3xl">{formatPrice(service.price, service.price_type)}</p>
                </div>
                {service.location && (
                  <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 shrink-0" />
                    {service.location}
                  </div>
                )}
              </div>

              {/* Contact Form */}
              <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
                <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Contact Provider
                </h3>
                {submitted ? (
                  <div className="mt-6 text-center py-4">
                    <CheckCircle2 className="mx-auto h-10 w-10 text-green-500" />
                    <p className="mt-2 font-medium text-foreground">Inquiry Sent!</p>
                    <p className="text-sm text-muted-foreground">The provider will contact you soon.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="mt-4 space-y-3 sm:space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-sm">Name *</Label>
                      <Input id="name" className="mt-1" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-sm">Email *</Label>
                      <Input id="email" type="email" className="mt-1" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-sm">Phone</Label>
                      <Input id="phone" className="mt-1" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                    </div>
                    <div>
                      <Label htmlFor="message" className="text-sm">Message *</Label>
                      <Textarea id="message" rows={3} className="mt-1" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} required />
                    </div>
                    <Button type="submit" className="w-full" disabled={createInquiry.isPending}>
                      {createInquiry.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Send Inquiry
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default ServiceDetail;
