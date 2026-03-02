import { Link } from "react-router-dom";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";
import type { Database } from "@/integrations/supabase/types";

type Category = Database["public"]["Tables"]["categories"]["Row"];

interface CategoryCardProps {
  category: Category;
  variant?: "default" | "compact";
  className?: string;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home: Icons.Home,
  Code: Icons.Code,
  Palette: Icons.Palette,
  GraduationCap: Icons.GraduationCap,
  Briefcase: Icons.Briefcase,
  Heart: Icons.Heart,
  PartyPopper: Icons.PartyPopper,
  Truck: Icons.Truck,
  Car: Icons.Car,
  Banknote: Icons.Banknote,
  UtensilsCrossed: Icons.UtensilsCrossed,
  Dumbbell: Icons.Dumbbell,
  Scale: Icons.Scale,
  Megaphone: Icons.Megaphone,
  Camera: Icons.Camera,
  Plane: Icons.Plane,
};

export function CategoryCard({ category, variant = "default", className }: CategoryCardProps) {
  const IconComponent = category.icon ? iconMap[category.icon] || Icons.Folder : Icons.Folder;

  if (variant === "compact") {
    return (
      <Link
        to={`/categories/${category.slug}`}
        className={cn(
          "group flex flex-col items-center gap-2.5 rounded-xl bg-card p-4 sm:p-5 text-center border border-border transition-all duration-200 hover:border-primary/30 hover:shadow-md",
          className
        )}
      >
        <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors duration-200 group-hover:bg-primary group-hover:text-primary-foreground">
          <IconComponent className="h-5 w-5 sm:h-6 sm:w-6 text-primary group-hover:text-primary-foreground transition-colors duration-200" />
        </div>
        <span className="text-xs sm:text-sm font-medium text-foreground">{category.name}</span>
      </Link>
    );
  }

  return (
    <Link
      to={`/categories/${category.slug}`}
      className={cn(
        "group flex items-center gap-4 rounded-xl bg-card p-4 sm:p-5 border border-border transition-all duration-200 hover:border-primary/30 hover:shadow-md",
        className
      )}
    >
      <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 transition-colors duration-200 group-hover:bg-primary">
        <IconComponent className="h-6 w-6 sm:h-7 sm:w-7 text-primary transition-colors duration-200 group-hover:text-primary-foreground" />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-sm sm:text-base font-semibold text-foreground">{category.name}</h3>
        {category.description && (
          <p className="mt-0.5 text-xs sm:text-sm text-muted-foreground line-clamp-1">
            {category.description}
          </p>
        )}
        <p className="mt-1 text-xs text-muted-foreground">
          {category.service_count || 0} services
        </p>
      </div>
    </Link>
  );
}
