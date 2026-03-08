import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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

  return (
    <AdminLayout title="Admin Dashboard" description="Overview of the platform">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Approval
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            {pendingLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-yellow-600">
                {pendingResult?.count ?? 0}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Services
            </CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {servicesLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{totalServicesCount}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Companies
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {companiesLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{companies?.length || 0}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Categories
            </CardTitle>
            <Folder className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {categoriesLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{categories?.length || 0}</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Pending Services Preview */}
      <Card className="mt-6">
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
              {pendingServices.slice(0, 5).map((service) => (
                <div
                  key={service.id}
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
                </div>
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
