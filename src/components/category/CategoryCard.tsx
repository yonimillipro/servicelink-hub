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

// Map icon names to Lucide icons
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
          "flex flex-col items-center gap-2 rounded-xl bg-card p-4 text-center transition-all hover:bg-primary hover:text-primary-foreground shadow-sm",
          className
        )}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <IconComponent className="h-6 w-6 text-primary" />
        </div>
        <span className="text-sm font-medium">{category.name}</span>
      </Link>
    );
  }

  return (
    <Link
      to={`/categories/${category.slug}`}
      className={cn(
        "group flex items-center gap-4 rounded-xl bg-card p-4 shadow-sm transition-all hover:shadow-md",
        className
      )}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary">
        <IconComponent className="h-7 w-7 text-primary transition-colors group-hover:text-primary-foreground" />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-foreground">{category.name}</h3>
        {category.description && (
          <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
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
