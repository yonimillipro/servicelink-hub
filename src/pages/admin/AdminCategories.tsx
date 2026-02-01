import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "@/hooks/useCategories";
import * as Icons from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home: Icons.Home,
  Code: Icons.Code,
  Palette: Icons.Palette,
  GraduationCap: Icons.GraduationCap,
  Briefcase: Icons.Briefcase,
  Heart: Icons.Heart,
  PartyPopper: Icons.PartyPopper,
  Truck: Icons.Truck,
};

export default function AdminCategories() {
  const { data: categories, isLoading } = useCategories();

  return (
    <AdminLayout title="Categories" description="Manage service categories">
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      ) : categories && categories.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const IconComponent = category.icon 
              ? iconMap[category.icon] || Icons.Folder 
              : Icons.Folder;
            
            return (
              <Card key={category.id}>
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {category.service_count || 0} services
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No categories found</p>
          </CardContent>
        </Card>
      )}
      
      <p className="mt-6 text-sm text-muted-foreground">
        Note: Category management is currently view-only. Categories are seeded in the database.
      </p>
    </AdminLayout>
  );
}
