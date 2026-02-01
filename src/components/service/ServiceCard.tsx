import { Link } from "react-router-dom";
import { MapPin, Star, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  priceType: "fixed" | "starting_from" | "negotiable";
  category: string;
  categorySlug: string;
  location: string;
  image: string;
  companyName: string;
  companyId: string;
  rating: number;
  reviewCount: number;
  isFeatured?: boolean;
  createdAt: string;
}

interface ServiceCardProps {
  service: Service;
  className?: string;
}

export function ServiceCard({ service, className }: ServiceCardProps) {
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
        return "Negotiable";
      default:
        return formatted;
    }
  };

  return (
    <Link
      to={`/services/${service.id}`}
      className={cn("group relative block overflow-hidden rounded-xl bg-card card-hover", className)}
    >
      {/* Featured Badge */}
      {service.isFeatured && (
        <div className="featured-badge">
          <Star className="h-3 w-3 fill-current" />
          Featured
        </div>
      )}

      {/* Image */}
      <div className="aspect-[4/3] overflow-hidden bg-secondary">
        <img
          src={service.image}
          alt={service.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <span className="category-badge bg-primary/10 text-primary">
          {service.category}
        </span>

        {/* Title */}
        <h3 className="mt-2 line-clamp-2 font-semibold text-foreground group-hover:text-primary transition-colors">
          {service.title}
        </h3>

        {/* Company */}
        <p className="mt-1 text-sm text-muted-foreground">
          by {service.companyName}
        </p>

        {/* Location & Rating */}
        <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {service.location}
          </span>
          {service.reviewCount > 0 && (
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-warning text-warning" />
              {service.rating.toFixed(1)} ({service.reviewCount})
            </span>
          )}
        </div>

        {/* Price */}
        <div className="mt-3 flex items-center justify-between">
          <span className="price-tag text-lg">
            {formatPrice(service.price, service.priceType)}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {new Date(service.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </Link>
  );
}
