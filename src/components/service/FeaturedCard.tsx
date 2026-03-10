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
    <motion.div
      whileHover={{ y: -4, scale: 1.03 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="group"
    >
      <Link
        to={`/services/${service.id}`}
        className={cn(
          "block overflow-hidden rounded-2xl bg-card shadow-md ring-1 ring-border/40 transition-shadow duration-300 hover:shadow-xl hover:shadow-primary/10",
          className
        )}
      >
        {/* Image with glass overlay */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={service.image || "/placeholder.svg"}
            alt={service.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />

          {/* Featured badge */}
          {service.is_featured && (
            <span className="absolute left-2.5 top-2.5 z-10 flex items-center gap-1 rounded-full bg-gradient-to-r from-primary to-primary/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow-lg shadow-primary/25 sm:text-[11px]">
              <Star className="h-2.5 w-2.5 fill-current sm:h-3 sm:w-3" />
              Featured
            </span>
          )}

          {/* Glass overlay at bottom */}
          <div className="absolute inset-x-0 bottom-0 z-[5] p-2.5 sm:p-3">
            <div className="rounded-xl border border-white/20 bg-white/15 px-3 py-2 backdrop-blur-md dark:bg-black/25 dark:border-white/10 sm:px-3.5 sm:py-2.5">
              <h4 className="line-clamp-1 text-xs font-semibold text-white drop-shadow-sm sm:text-sm">
                {service.title}
              </h4>

              {service.companies && (
                <p className="mt-0.5 flex items-center gap-1 text-[10px] text-white/80 truncate sm:text-[11px]">
                  {service.companies.name}
                  {service.companies.verified && (
                    <CheckCircle2 className="h-2.5 w-2.5 shrink-0 text-green-400 sm:h-3 sm:w-3" />
                  )}
                </p>
              )}

              {stats && stats.count > 0 && (
                <div className="mt-1 flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-2.5 w-2.5 sm:h-3 sm:w-3",
                        i < Math.round(stats.average)
                          ? "fill-amber-400 text-amber-400"
                          : "fill-white/20 text-white/20"
                      )}
                    />
                  ))}
                  <span className="ml-1 text-[10px] font-medium text-white/70 sm:text-[11px]">
                    ({stats.count})
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Gradient scrim behind glass for readability */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
        </div>
      </Link>
    </motion.div>
  );
}
