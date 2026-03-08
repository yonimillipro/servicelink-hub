import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCategories } from "@/hooks/useCategories";
import { useMyCompany } from "@/hooks/useCompanies";
import { useCreateService } from "@/hooks/useServices";
import { useAddServiceImage } from "@/hooks/useServiceImages";
import { ImageUploader } from "@/components/service/ImageUploader";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { Link } from "react-router-dom";

const serviceSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  description: z.string().min(10, "Description must be at least 10 characters").max(2000),
  categoryId: z.string().min(1, "Please select a category"),
  priceType: z.enum(["fixed", "starting_from", "negotiable"]),
  price: z.number().min(0).optional(),
  location: z.string().max(100).optional(),
  image: z.string().url().optional().or(z.literal("")),
});

type PriceType = "fixed" | "starting_from" | "negotiable";

export default function AddService() {
  const navigate = useNavigate();
  const { data: categories } = useCategories();
  const { data: company, isLoading: companyLoading } = useMyCompany();
  const createService = useCreateService();
  const addServiceImage = useAddServiceImage();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryId: "",
    priceType: "fixed" as PriceType,
    price: "",
    location: "",
    image: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = serviceSchema.safeParse({
      ...formData,
      price: formData.price ? parseFloat(formData.price) : undefined,
    });

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    if (!company) {
      toast.error("Please create a company profile first");
      return;
    }

    try {
      await createService.mutateAsync({
        title: formData.title,
        description: formData.description,
        category_id: formData.categoryId,
        price_type: formData.priceType,
        price: formData.price ? parseFloat(formData.price) : null,
        location: formData.location || null,
        image: formData.image || null,
        company_id: company.id,
        status: "pending",
      });

      toast.success("Service submitted for review!");
      navigate("/dashboard/services");
    } catch (error: any) {
      toast.error(error.message || "Failed to create service");
    }
  };

  if (companyLoading) {
    return (
      <DashboardLayout title="Add Service" description="Create a new service listing">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!company) {
    return (
      <DashboardLayout title="Add Service" description="Create a new service listing">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              Please create a company profile first before adding services.
            </p>
            <Link to="/dashboard/company">
              <Button className="mt-4">Create Company Profile</Button>
            </Link>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Add Service" description="Create a new service listing">
      <Card>
        <CardHeader>
          <CardTitle>Service Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Service Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Professional Web Development"
              />
              {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your service in detail..."
                rows={5}
              />
              {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select 
                  value={formData.categoryId} 
                  onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.categoryId && <p className="text-sm text-destructive">{errors.categoryId}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Addis Ababa"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="priceType">Price Type *</Label>
                <Select 
                  value={formData.priceType} 
                  onValueChange={(value: PriceType) => 
                    setFormData({ ...formData, priceType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed Price</SelectItem>
                    <SelectItem value="starting_from">Starting From</SelectItem>
                    <SelectItem value="negotiable">Negotiable</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price (ETB)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="e.g., 5000"
                  min="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
              <p className="text-xs text-muted-foreground">
                Enter a URL for your service image
              </p>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={createService.isPending}>
                {createService.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit for Review
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate("/dashboard/services")}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
