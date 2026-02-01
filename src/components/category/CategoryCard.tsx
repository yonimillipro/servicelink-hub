import { Link } from "react-router-dom";
import { 
  Monitor, 
  Home, 
  Palette, 
  Megaphone, 
  GraduationCap, 
  Briefcase,
  Truck,
  Camera,
  LucideIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  serviceCount: number;
  color: string;
}

const iconMap: Record<string, LucideIcon> = {
  monitor: Monitor,
  home: Home,
  palette: Palette,
  megaphone: Megaphone,
  graduation: GraduationCap,
  briefcase: Briefcase,
  truck: Truck,
  camera: Camera,
};

const colorMap: Record<string, string> = {
  it: "bg-category-it/10 text-category-it group-hover:bg-category-it",
  home: "bg-category-home/10 text-category-home group-hover:bg-category-home",
  creative: "bg-category-creative/10 text-category-creative group-hover:bg-category-creative",
  marketing: "bg-category-marketing/10 text-category-marketing group-hover:bg-category-marketing",
  education: "bg-category-education/10 text-category-education group-hover:bg-category-education",
  business: "bg-category-business/10 text-category-business group-hover:bg-category-business",
};

interface CategoryCardProps {
  category: Category;
  variant?: "default" | "compact";
  className?: string;
}

export function CategoryCard({ category, variant = "default", className }: CategoryCardProps) {
  const Icon = iconMap[category.icon] || Briefcase;
  const colorClasses = colorMap[category.color] || colorMap.business;

  if (variant === "compact") {
    return (
      <Link
        to={`/categories/${category.slug}`}
        className={cn(
          "group flex flex-col items-center gap-2 rounded-xl p-4 transition-all hover:bg-secondary",
          className
        )}
      >
        <div className={cn(
          "flex h-12 w-12 items-center justify-center rounded-xl transition-colors group-hover:text-white",
          colorClasses
        )}>
          <Icon className="h-6 w-6" />
        </div>
        <span className="text-center text-sm font-medium text-foreground">
          {category.name}
        </span>
      </Link>
    );
  }

  return (
    <Link
      to={`/categories/${category.slug}`}
      className={cn(
        "group flex items-center gap-4 rounded-xl bg-card p-4 card-hover",
        className
      )}
    >
      <div className={cn(
        "flex h-14 w-14 shrink-0 items-center justify-center rounded-xl transition-colors group-hover:text-white",
        colorClasses
      )}>
        <Icon className="h-7 w-7" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
          {category.name}
        </h3>
        <p className="text-sm text-muted-foreground">
          {category.serviceCount.toLocaleString()} services
        </p>
      </div>
    </Link>
  );
}
