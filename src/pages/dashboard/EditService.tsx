import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "@/hooks/useCategories";
import { useServiceById, useUpdateService } from "@/hooks/useServices";
import { useServiceImages, useAddServiceImage, useDeleteServiceImage } from "@/hooks/useServiceImages";
import { ImageUploader } from "@/components/service/ImageUploader";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

type PriceType = "fixed" | "starting_from" | "negotiable";

export default function EditService() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: service, isLoading } = useServiceById(id);
  const { data: existingImages } = useServiceImages(id);
  const { data: categories } = useCategories();
  const updateService = useUpdateService();
  const addServiceImage = useAddServiceImage();
  const deleteServiceImage = useDeleteServiceImage();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryId: "",
    priceType: "fixed" as PriceType,
    price: "",
    location: "",
    image: "",
  });
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  useEffect(() => {
    if (service) {
      setFormData({
        title: service.title,
        description: service.description || "",
        categoryId: service.category_id || "",
        priceType: (service.price_type as PriceType) || "fixed",
        price: service.price?.toString() || "",
        location: service.location || "",
        image: service.image || "",
      });
    }
  }, [service]);

  useEffect(() => {
    if (existingImages) {
      setGalleryImages(existingImages.map((img) => img.image_url));
    }
  }, [existingImages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) return;

    try {
      await updateService.mutateAsync({
        id,
        title: formData.title,
        description: formData.description,
        category_id: formData.categoryId,
        price_type: formData.priceType,
        price: formData.price ? parseFloat(formData.price) : null,
        location: formData.location || null,
        image: formData.image || (galleryImages.length > 0 ? galleryImages[0] : null),
      });

      // Sync gallery images: delete removed, add new
      const existingUrls = (existingImages || []).map((img) => img.image_url);
      const toDelete = (existingImages || []).filter((img) => !galleryImages.includes(img.image_url));
      const toAdd = galleryImages.filter((url) => !existingUrls.includes(url));

      for (const img of toDelete) {
        await deleteServiceImage.mutateAsync({ id: img.id, serviceId: id });
      }
      for (const url of toAdd) {
        await addServiceImage.mutateAsync({ serviceId: id, imageUrl: url });
      }

      toast.success("Service updated successfully!");
      navigate("/dashboard/services");
    } catch (error: any) {
      toast.error(error.message || "Failed to update service");
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Edit Service">
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

  if (!service) {
    return (
      <DashboardLayout title="Edit Service">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Service not found.</p>
            <Button className="mt-4" onClick={() => navigate("/dashboard/services")}>
              Back to Services
            </Button>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Edit Service" description={`Editing: ${service.title}`}>
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
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={5}
                required
              />
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
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
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={updateService.isPending}>
                {updateService.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
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
