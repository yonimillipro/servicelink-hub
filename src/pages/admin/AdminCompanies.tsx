import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAllCompanies, useUpdateCompany } from "@/hooks/useCompanies";
import { CheckCircle, XCircle, Building2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminCompanies() {
  const { data: companies, isLoading, refetch } = useAllCompanies();
  const updateCompany = useUpdateCompany();

  const handleVerify = async (id: string, verified: boolean) => {
    try {
      await updateCompany.mutateAsync({ id, verified: !verified });
      toast.success(verified ? "Verification removed" : "Company verified");
      refetch();
    } catch {
      toast.error("Failed to update company");
    }
  };

  const handleSuspend = async (id: string, status: string) => {
    try {
      const newStatus = status === "active" ? "suspended" : "active";
      await updateCompany.mutateAsync({ id, status: newStatus });
      toast.success(newStatus === "suspended" ? "Company suspended" : "Company reactivated");
      refetch();
    } catch {
      toast.error("Failed to update company status");
    }
  };

  return (
    <AdminLayout title="Companies" description="Manage registered companies">
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      ) : companies && companies.length > 0 ? (
        <div className="space-y-4">
          {companies.map((company) => (
            <Card key={company.id}>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-secondary">
                  {company.logo_url ? (
                    <img
                      src={company.logo_url}
                      alt={company.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Building2 className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold truncate">{company.name}</h3>
                    {company.verified && (
                      <Badge className="bg-green-100 text-green-700">Verified</Badge>
                    )}
                    {company.status === "suspended" && (
                      <Badge variant="destructive">Suspended</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {company.location || "No location"} • {company.email || "No email"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Joined {new Date(company.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant={company.verified ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => handleVerify(company.id, company.verified || false)}
                  >
                    <CheckCircle className={`mr-2 h-4 w-4 ${company.verified ? "text-green-600" : ""}`} />
                    {company.verified ? "Verified" : "Verify"}
                  </Button>
                  <Button 
                    variant={company.status === "suspended" ? "default" : "destructive"}
                    size="sm"
                    onClick={() => handleSuspend(company.id, company.status || "active")}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    {company.status === "suspended" ? "Reactivate" : "Suspend"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">No companies registered yet</p>
          </CardContent>
        </Card>
      )}
    </AdminLayout>
  );
}
