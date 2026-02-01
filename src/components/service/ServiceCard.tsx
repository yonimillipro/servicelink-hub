import { Link } from "react-router-dom";
import { MapPin, Star, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ServiceWithRelations } from "@/hooks/useServices";

interface ServiceCardProps {
  service: ServiceWithRelations;
  className?: string;
}

export function ServiceCard({ service, className }: ServiceCardProps) {
  const formatPrice = (price: number | null, type: string | null) => {
    if (!price) return "Contact for price";
    
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
      {service.is_featured && (
        <div className="featured-badge">
          <Star className="h-3 w-3 fill-current" />
          Featured
        </div>
      )}

      {/* Image */}
      <div className="aspect-[4/3] overflow-hidden bg-secondary">
        <img
          src={service.image || "/placeholder.svg"}
          alt={service.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        {service.categories && (
          <span className="category-badge bg-primary/10 text-primary">
            {service.categories.name}
          </span>
        )}

        {/* Title */}
        <h3 className="mt-2 line-clamp-2 font-semibold text-foreground group-hover:text-primary transition-colors">
          {service.title}
        </h3>

        {/* Company */}
        {service.companies && (
          <p className="mt-1 text-sm text-muted-foreground">
            by {service.companies.name}
          </p>
        )}

        {/* Location */}
        <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
          {service.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {service.location}
            </span>
          )}
        </div>

        {/* Price */}
        <div className="mt-3 flex items-center justify-between">
          <span className="price-tag text-lg">
            {formatPrice(service.price, service.price_type)}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {new Date(service.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>
    </Link>
  );
}
