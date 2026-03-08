import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { EmptyState } from "@/components/ui/empty-state";
import { motion } from "@/components/ui/motion";
import { useMyCompany } from "@/hooks/useCompanies";
import { useServices } from "@/hooks/useServices";
import { useInquiriesForProvider } from "@/hooks/useInquiries";
import { Package, MessageSquare, CheckCircle, Clock, Plus } from "lucide-react";

export default function Dashboard() {
  const { data: company, isLoading: companyLoading } = useMyCompany();
  const { data: servicesResult, isLoading: servicesLoading } = useServices({
    companyId: company?.id,
    status: undefined,
  });
  const services = servicesResult?.data;
  const { data: inquiries, isLoading: inquiriesLoading } = useInquiriesForProvider();

  const pendingServices = services?.filter(s => s.status === "pending").length || 0;
  const approvedServices = services?.filter(s => s.status === "approved").length || 0;
  const newInquiries = inquiries?.filter(i => i.status === "new").length || 0;

  if (!companyLoading && !company) {
    return (
      <DashboardLayout title="Welcome!" description="Let's get you set up">
        <EmptyState
          icon={Package}
          title="Create Your Company Profile"
          description="Before you can list services, you need to create your company profile."
          actionLabel="Create Company Profile"
          actionHref="/dashboard/company"
        />
      </DashboardLayout>
    );
  }

  const statCards = [
    { title: "Total Services", value: services?.length || 0, icon: Package, color: "text-foreground", loading: servicesLoading },
    { title: "Approved", value: approvedServices, icon: CheckCircle, color: "text-green-600", loading: servicesLoading },
    { title: "Pending Review", value: pendingServices, icon: Clock, color: "text-yellow-600", loading: servicesLoading },
    { title: "New Inquiries", value: newInquiries, icon: MessageSquare, color: "text-primary", loading: inquiriesLoading },
  ];

  return (
    <DashboardLayout title="Dashboard" description="Overview of your services and inquiries">
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
                <stat.icon className={cn("h-4 w-4", stat.color === "text-foreground" ? "text-muted-foreground" : stat.color)} />
              </CardHeader>
              <CardContent>
                {stat.loading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <div className={cn("text-2xl font-bold", stat.color)}>
                    <AnimatedCounter value={stat.value} />
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Card className="transition-shadow hover:shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Recent Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            {servicesLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12" />)}
              </div>
            ) : services && services.length > 0 ? (
              <div className="space-y-2">
                {services.slice(0, 3).map((service) => (
                  <Link
                    key={service.id}
                    to={`/dashboard/services/${service.id}/edit`}
                    className="flex items-center justify-between rounded-lg bg-secondary p-3 transition-colors hover:bg-secondary/80"
                  >
                    <span className="font-medium truncate">{service.title}</span>
                    <span className={cn("text-xs px-2 py-1 rounded-full",
                      service.status === "approved" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : service.status === "pending" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    )}>
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

        <Card className="transition-shadow hover:shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Recent Inquiries
            </CardTitle>
          </CardHeader>
          <CardContent>
            {inquiriesLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12" />)}
              </div>
            ) : inquiries && inquiries.length > 0 ? (
              <div className="space-y-2">
                {inquiries.slice(0, 3).map((inquiry) => (
                  <div
                    key={inquiry.id}
                    className="flex items-center justify-between rounded-lg bg-secondary p-3"
                  >
                    <div className="min-w-0">
                      <p className="font-medium truncate">{inquiry.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{inquiry.services?.title}</p>
                    </div>
                    <span className={cn("text-xs px-2 py-1 rounded-full shrink-0",
                      inquiry.status === "new" ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
                    )}>
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

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
