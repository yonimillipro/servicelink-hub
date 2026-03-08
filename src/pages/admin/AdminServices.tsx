import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useServices, useUpdateService } from "@/hooks/useServices";
import { Check, X, Star, Eye } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Label } from "@/components/ui/label";

export default function AdminServices() {
  const [activeTab, setActiveTab] = useState("pending");
  const { data: pendingResult, isLoading: pendingLoading, refetch: refetchPending } = 
    useServices({ status: "pending" });
  const pendingServices = pendingResult?.data;
  const { data: approvedResult, isLoading: approvedLoading, refetch: refetchApproved } = 
    useServices({ status: "approved" });
  const approvedServices = approvedResult?.data;
  const { data: rejectedResult, isLoading: rejectedLoading, refetch: refetchRejected } = 
    useServices({ status: "rejected" });
  const rejectedServices = rejectedResult?.data;
  
  const updateService = useUpdateService();

  const handleApprove = async (id: string) => {
    try {
      await updateService.mutateAsync({ id, status: "approved" });
      toast.success("Service approved");
      refetchPending();
      refetchApproved();
    } catch {
      toast.error("Failed to approve service");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await updateService.mutateAsync({ id, status: "rejected" });
      toast.success("Service rejected");
      refetchPending();
      refetchRejected();
    } catch {
      toast.error("Failed to reject service");
    }
  };

  const handleFeature = async (id: string, isFeatured: boolean) => {
    try {
      await updateService.mutateAsync({ id, is_featured: !isFeatured });
      toast.success(isFeatured ? "Removed from featured" : "Added to featured");
      refetchApproved();
    } catch {
      toast.error("Failed to update featured status");
    }
  };

  const renderServiceList = (services: any[] | undefined, isLoading: boolean, showActions: boolean) => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      );
    }

    if (!services || services.length === 0) {
      return (
        <div className="py-12 text-center text-muted-foreground">
          No services found
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {services.map((service) => (
          <Card key={service.id}>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-secondary">
                <img
                  src={service.image || "/placeholder.svg"}
                  alt={service.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold truncate">{service.title}</h3>
                  {service.is_featured && (
                    <Badge className="bg-yellow-100 text-yellow-700">Featured</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  by {service.companies?.name} • {service.categories?.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {service.location || "No location"} • 
                  {service.price ? ` ETB ${service.price.toLocaleString()}` : " Contact for price"}
                </p>
              </div>
              <div className="flex gap-2">
                <Link to={`/services/${service.id}`}>
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
                
                {showActions && activeTab === "pending" && (
                  <>
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="text-green-600 hover:bg-green-50"
                      onClick={() => handleApprove(service.id)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="text-red-600 hover:bg-red-50"
                      onClick={() => handleReject(service.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                )}
                
                {activeTab === "approved" && (
                  <div className="flex items-center gap-2">
                    <Switch
                      id={`featured-${service.id}`}
                      checked={!!service.is_featured}
                      onCheckedChange={() => handleFeature(service.id, service.is_featured)}
                    />
                    <Label htmlFor={`featured-${service.id}`} className="text-xs text-muted-foreground cursor-pointer">
                      Featured
                    </Label>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <AdminLayout title="Services" description="Review and manage service listings">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="pending" className="gap-2">
            Pending
            {pendingServices && pendingServices.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {pendingServices.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          {renderServiceList(pendingServices, pendingLoading, true)}
        </TabsContent>

        <TabsContent value="approved">
          {renderServiceList(approvedServices, approvedLoading, true)}
        </TabsContent>

        <TabsContent value="rejected">
          {renderServiceList(rejectedServices, rejectedLoading, false)}
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
