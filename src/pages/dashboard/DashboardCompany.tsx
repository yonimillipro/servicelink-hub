import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyCompany, useCreateCompany, useUpdateCompany } from "@/hooks/useCompanies";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, Building2 } from "lucide-react";
import { toast } from "sonner";

export default function DashboardCompany() {
  const { user } = useAuth();
  const { data: company, isLoading } = useMyCompany();
  const createCompany = useCreateCompany();
  const updateCompany = useUpdateCompany();

  const [formData, setFormData] = useState({
    name: company?.name || "",
    description: company?.description || "",
    location: company?.location || "",
    phone: company?.phone || "",
    email: company?.email || "",
    logo_url: company?.logo_url || "",
  });

  // Update form when company data loads
  useState(() => {
    if (company) {
      setFormData({
        name: company.name || "",
        description: company.description || "",
        location: company.location || "",
        phone: company.phone || "",
        email: company.email || "",
        logo_url: company.logo_url || "",
      });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("You must be logged in");
      return;
    }

    try {
      if (company) {
        await updateCompany.mutateAsync({
          id: company.id,
          ...formData,
        });
        toast.success("Company profile updated!");
      } else {
        await createCompany.mutateAsync({
          owner_id: user.id,
          ...formData,
        });
        toast.success("Company profile created!");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to save company profile");
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Company Profile" description="Manage your company information">
        <Card>
          <CardContent className="space-y-4 py-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10" />
            ))}
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      title="Company Profile" 
      description={company ? "Update your company information" : "Create your company profile to start listing services"}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {company ? "Edit Company" : "Create Company"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Company Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your Company Name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Tell customers about your company..."
                rows={4}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Addis Ababa"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+251 91 234 5678"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Business Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="contact@yourcompany.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo_url">Logo URL</Label>
              <Input
                id="logo_url"
                value={formData.logo_url}
                onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                placeholder="https://example.com/logo.png"
              />
              <p className="text-xs text-muted-foreground">
                Enter a URL for your company logo
              </p>
            </div>

            <Button 
              type="submit" 
              disabled={createCompany.isPending || updateCompany.isPending}
            >
              {(createCompany.isPending || updateCompany.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {company ? "Save Changes" : "Create Company"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
