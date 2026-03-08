import { Link } from "react-router-dom";
import { MapPin, Star, Clock, CheckCircle2, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ServiceWithRelations } from "@/hooks/useServices";
import { useReviewStats } from "@/hooks/useReviews";
import { useSavedServices, useToggleSave } from "@/hooks/useSavedServices";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface ServiceCardProps {
  service: ServiceWithRelations;
  className?: string;
}

export function ServiceCard({ service, className }: ServiceCardProps) {
  const { data: stats } = useReviewStats(service.id);
  const { user } = useAuth();
  const { data: savedIds } = useSavedServices();
  const toggleSave = useToggleSave();
  const isSaved = savedIds?.includes(service.id) ?? false;

  const handleToggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error("Sign in to save services");
      return;
    }
    toggleSave.mutate({ serviceId: service.id, isSaved });
  };
  const formatPrice = (price: number | null, type: string | null) => {
    if (!price) return "Contact for price";
    const formatted = new Intl.NumberFormat("en-ET", {
      style: "currency",
      currency: "ETB",
      minimumFractionDigits: 0,
    }).format(price);
    switch (type) {
      case "starting_from": return `From ${formatted}`;
      case "negotiable": return "Negotiable";
      default: return formatted;
    }
  };

  return (
    <Link
      to={`/services/${service.id}`}
      className={cn(
        "group relative block overflow-hidden rounded-xl bg-card card-hover",
        service.is_featured && "ring-1 ring-primary/30 shadow-[0_0_12px_-3px_hsl(var(--primary)/0.2)]",
        className
      )}
    >
      {service.is_featured && (
        <div className="featured-badge">
          <Star className="h-3 w-3 fill-current" />
          Featured
        </div>
      )}

      <div className="aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={service.image || "/placeholder.svg"}
          alt={service.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="p-4 sm:p-5">
        {service.categories && (
          <span className="category-badge bg-primary/10 text-primary text-[11px]">
            {service.categories.name}
          </span>
        )}

        <h3 className="mt-2 line-clamp-2 text-base font-semibold text-foreground group-hover:text-primary transition-colors sm:text-[15px]">
          {service.title}
        </h3>

        {service.companies && (
          <p className="mt-1.5 flex items-center gap-1 text-sm text-muted-foreground truncate">
            by {service.companies.name}
            {service.companies.verified && (
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-green-600" />
            )}
          </p>
        )}

        {stats && stats.count > 0 && (
          <div className="mt-2 flex items-center gap-1 text-xs">
            <Star className="h-3.5 w-3.5 fill-current text-amber-500" />
            <span className="font-medium text-foreground">{stats.average.toFixed(1)}</span>
            <span className="text-muted-foreground">({stats.count})</span>
          </div>
        )}

        {service.location && (
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{service.location}</span>
          </div>
        )}

        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
          <span className="price-tag text-base sm:text-lg">
            {formatPrice(service.price, service.price_type)}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Clock className="h-3 w-3" />
            {new Date(service.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>
    </Link>
  );
}
