import { Link } from "react-router-dom";
import { Star, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ServiceWithRelations } from "@/hooks/useServices";
import { useReviewStats } from "@/hooks/useReviews";

interface FeaturedCardProps {
  service: ServiceWithRelations;
  className?: string;
}

export function FeaturedCard({ service, className }: FeaturedCardProps) {
  const { data: stats } = useReviewStats(service.id);

  return (
    <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }}>
      <Link
        to={`/services/${service.id}`}
        className={cn(
          "group block overflow-hidden rounded-xl bg-card shadow-sm ring-1 ring-border/50 transition-shadow hover:shadow-lg",
          className
        )}
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={service.image || "/placeholder.svg"}
            alt={service.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {service.is_featured && (
            <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground shadow-sm sm:text-[11px]">
              <Star className="h-2.5 w-2.5 fill-current sm:h-3 sm:w-3" />
              Featured
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-2.5 sm:p-3">
          <h4 className="line-clamp-1 text-xs font-semibold text-foreground group-hover:text-primary transition-colors sm:text-sm">
            {service.title}
          </h4>

          {service.companies && (
            <p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground truncate sm:text-xs">
              {service.companies.name}
              {service.companies.verified && (
                <CheckCircle2 className="h-3 w-3 shrink-0 text-green-600" />
              )}
            </p>
          )}

          {stats && stats.count > 0 && (
            <div className="mt-1.5 flex items-center gap-1 text-[10px] sm:text-xs">
              <Star className="h-3 w-3 fill-current text-amber-500" />
              <span className="font-medium text-foreground">{stats.average.toFixed(1)}</span>
              <span className="text-muted-foreground">({stats.count})</span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
