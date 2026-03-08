import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { motion } from "@/components/ui/motion";
import { useServices } from "@/hooks/useServices";
import { useAllCompanies } from "@/hooks/useCompanies";
import { useCategories } from "@/hooks/useCategories";
import { Package, Building2, Folder, Clock } from "lucide-react";

export default function AdminDashboard() {
  const { data: pendingResult, isLoading: pendingLoading } = useServices({ status: "pending" });
  const pendingServices = pendingResult?.data;
  const { data: allResult, isLoading: servicesLoading } = useServices({ status: null });
  const totalServicesCount = allResult?.count ?? 0;
  const { data: companies, isLoading: companiesLoading } = useAllCompanies();
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  const statCards = [
    { title: "Pending Approval", value: pendingResult?.count ?? 0, icon: Clock, color: "text-yellow-600", loading: pendingLoading },
    { title: "Total Services", value: totalServicesCount, icon: Package, color: "text-primary", loading: servicesLoading },
    { title: "Companies", value: companies?.length || 0, icon: Building2, color: "text-foreground", loading: companiesLoading },
    { title: "Categories", value: categories?.length || 0, icon: Folder, color: "text-foreground", loading: categoriesLoading },
  ];

  return (
    <AdminLayout title="Admin Dashboard" description="Overview of the platform">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: i * 0.05 }}
          >
            <Card className="transition-shadow hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color === "text-foreground" ? "text-muted-foreground" : stat.color}`} />
              </CardHeader>
              <CardContent>
                {stat.loading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <div className={`text-2xl font-bold ${stat.color}`}>
                    <AnimatedCounter value={stat.value} />
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Pending Services Preview */}
      <Card className="mt-6 transition-shadow hover:shadow-md">
        <CardHeader>
          <CardTitle>Services Pending Review</CardTitle>
        </CardHeader>
        <CardContent>
          {pendingLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-12" />
              ))}
            </div>
          ) : pendingServices && pendingServices.length > 0 ? (
            <div className="space-y-2">
              {pendingServices.slice(0, 5).map((service, i) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.04 }}
                  className="flex items-center justify-between rounded-lg bg-secondary p-3"
                >
                  <div>
                    <p className="font-medium">{service.title}</p>
                    <p className="text-xs text-muted-foreground">
                      by {service.companies?.name}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(service.created_at).toLocaleDateString()}
                  </span>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="py-6 text-center text-muted-foreground">
              No services pending approval
            </p>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
