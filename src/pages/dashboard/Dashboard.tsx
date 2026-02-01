import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyCompany } from "@/hooks/useCompanies";
import { useServices } from "@/hooks/useServices";
import { useInquiriesForProvider } from "@/hooks/useInquiries";
import { Package, MessageSquare, CheckCircle, Clock, AlertCircle, Plus } from "lucide-react";

export default function Dashboard() {
  const { data: company, isLoading: companyLoading } = useMyCompany();
  const { data: services, isLoading: servicesLoading } = useServices({ 
    companyId: company?.id,
    status: undefined // Get all statuses for provider
  });
  const { data: inquiries, isLoading: inquiriesLoading } = useInquiriesForProvider();

  const pendingServices = services?.filter(s => s.status === "pending").length || 0;
  const approvedServices = services?.filter(s => s.status === "approved").length || 0;
  const newInquiries = inquiries?.filter(i => i.status === "new").length || 0;

  if (!companyLoading && !company) {
    return (
      <DashboardLayout title="Welcome!" description="Let's get you set up">
        <Card>
          <CardContent className="py-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Package className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Create Your Company Profile</h3>
            <p className="mt-2 text-muted-foreground">
              Before you can list services, you need to create your company profile.
            </p>
            <Link to="/dashboard/company">
              <Button className="mt-6">Create Company Profile</Button>
            </Link>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Dashboard" description="Overview of your services and inquiries">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Services
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {servicesLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{services?.length || 0}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Approved
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            {servicesLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-green-600">{approvedServices}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Review
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            {servicesLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-yellow-600">{pendingServices}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              New Inquiries
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {inquiriesLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-primary">{newInquiries}</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Recent Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            {servicesLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-12" />
                ))}
              </div>
            ) : services && services.length > 0 ? (
              <div className="space-y-2">
                {services.slice(0, 3).map((service) => (
                  <Link
                    key={service.id}
                    to={`/dashboard/services/${service.id}/edit`}
                    className="flex items-center justify-between rounded-lg bg-secondary p-3 hover:bg-secondary/80"
                  >
                    <span className="font-medium">{service.title}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      service.status === "approved" 
                        ? "bg-green-100 text-green-700"
                        : service.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                      {service.status}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No services yet</p>
                <Link to="/dashboard/services/add">
                  <Button variant="outline" className="mt-2 gap-2">
                    <Plus className="h-4 w-4" />
                    Add Your First Service
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Recent Inquiries
            </CardTitle>
          </CardHeader>
          <CardContent>
            {inquiriesLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-12" />
                ))}
              </div>
            ) : inquiries && inquiries.length > 0 ? (
              <div className="space-y-2">
                {inquiries.slice(0, 3).map((inquiry) => (
                  <div
                    key={inquiry.id}
                    className="flex items-center justify-between rounded-lg bg-secondary p-3"
                  >
                    <div>
                      <p className="font-medium">{inquiry.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {inquiry.services?.title}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      inquiry.status === "new" 
                        ? "bg-primary/10 text-primary"
                        : "bg-secondary text-muted-foreground"
                    }`}>
                      {inquiry.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No inquiries yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
