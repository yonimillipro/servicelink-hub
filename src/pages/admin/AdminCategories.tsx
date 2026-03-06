import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/hooks/useCategories";
import * as Icons from "lucide-react";
import { Plus, Edit, Trash2, Loader2, Folder } from "lucide-react";
import { toast } from "sonner";

const iconOptions = [
  "Home", "Code", "Palette", "GraduationCap", "Briefcase", "Heart",
  "PartyPopper", "Truck", "Car", "Banknote", "UtensilsCrossed",
  "Dumbbell", "Scale", "Megaphone", "Camera", "Plane", "Folder",
  "Wrench", "ShoppingCart", "Music", "Wifi", "Globe",
];

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home: Icons.Home, Code: Icons.Code, Palette: Icons.Palette,
  GraduationCap: Icons.GraduationCap, Briefcase: Icons.Briefcase,
  Heart: Icons.Heart, PartyPopper: Icons.PartyPopper, Truck: Icons.Truck,
  Car: Icons.Car, Banknote: Icons.Banknote, UtensilsCrossed: Icons.UtensilsCrossed,
  Dumbbell: Icons.Dumbbell, Scale: Icons.Scale, Megaphone: Icons.Megaphone,
  Camera: Icons.Camera, Plane: Icons.Plane, Folder: Icons.Folder,
  Wrench: Icons.Wrench, ShoppingCart: Icons.ShoppingCart, Music: Icons.Music,
  Wifi: Icons.Wifi, Globe: Icons.Globe,
};

interface CategoryForm {
  name: string;
  slug: string;
  description: string;
  icon: string;
}

const emptyForm: CategoryForm = { name: "", slug: "", description: "", icon: "Folder" };

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function AdminCategories() {
  const { data: categories, isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<CategoryForm>(emptyForm);

  const openCreate = () => {
    setEditId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (cat: any) => {
    setEditId(cat.id);
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
      icon: cat.icon || "Folder",
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    const slug = form.slug.trim() || slugify(form.name);
    try {
      if (editId) {
        await updateCategory.mutateAsync({
          id: editId,
          name: form.name,
          slug,
          description: form.description || null,
          icon: form.icon || null,
        });
        toast.success("Category updated");
      } else {
        await createCategory.mutateAsync({
          name: form.name,
          slug,
          description: form.description || null,
          icon: form.icon || null,
        });
        toast.success("Category created");
      }
      setDialogOpen(false);
    } catch (e: any) {
      toast.error(e.message || "Failed to save category");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteCategory.mutateAsync(deleteId);
      toast.success("Category deleted");
    } catch (e: any) {
      toast.error(e.message || "Failed to delete category");
    }
    setDeleteId(null);
  };

  const isSaving = createCategory.isPending || updateCategory.isPending;

  return (
    <AdminLayout title="All Categories" description="Browse and manage service categories">
      <div className="mb-5 flex justify-end">
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" /> Add Category
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 sm:gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl sm:h-24" />
          ))}
        </div>
      ) : categories && categories.length > 0 ? (
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 sm:gap-4">
          {categories.map((category) => {
            const IconComponent = category.icon
              ? iconMap[category.icon] || Folder
              : Folder;
            return (
              <div
                key={category.id}
                className="group relative flex items-start gap-4 rounded-xl border bg-card p-4 transition-all hover:shadow-md sm:p-5"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 sm:h-12 sm:w-12">
                  <IconComponent className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">{category.name}</h3>
                  {category.description && (
                    <p className="mt-0.5 text-sm text-muted-foreground line-clamp-2">
                      {category.description}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-muted-foreground">
                    {category.service_count || 0} services
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(category)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDeleteId(category.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border py-12 text-center">
          <p className="text-muted-foreground">No categories available.</p>
        </div>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editId ? "Edit Category" : "Add Category"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input
                value={form.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setForm((f) => ({
                    ...f,
                    name,
                    slug: editId ? f.slug : slugify(name),
                  }));
                }}
                placeholder="e.g. Home Services"
              />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                placeholder="auto-generated from name"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Brief description"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Icon</Label>
              <Select value={form.icon} onValueChange={(v) => setForm((f) => ({ ...f, icon: v }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((name) => {
                    const Ic = iconMap[name] || Folder;
                    return (
                      <SelectItem key={name} value={name}>
                        <span className="flex items-center gap-2">
                          <Ic className="h-4 w-4" /> {name}
                        </span>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editId ? "Save Changes" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure? Services in this category won't be deleted but will lose their category assignment.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
