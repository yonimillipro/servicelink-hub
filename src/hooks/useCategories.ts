import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Category = Database["public"]["Tables"]["categories"]["Row"];
type CategoryInsert = Database["public"]["Tables"]["categories"]["Insert"];
type CategoryUpdate = Database["public"]["Tables"]["categories"]["Update"];

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async (): Promise<Category[]> => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data || [];
    },
  });
}

export function useCategoryBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ["category", slug],
    queryFn: async (): Promise<Category | null> => {
      if (!slug) return null;
      
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (category: CategoryInsert) => {
      const { data, error } = await supabase
        .from("categories")
        .insert(category)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: CategoryUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("categories")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export interface CategoryWithCount {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  service_count: number;
  created_at: string;
  updated_at: string;
}

export function useCategoriesWithCount() {
  return useQuery({
    queryKey: ["categories-with-count"],
    queryFn: async (): Promise<CategoryWithCount[]> => {
      // Fetch all categories
      const { data: categories, error: catError } = await supabase
        .from("categories")
        .select("*")
        .order("name");
      if (catError) throw catError;

      // Fetch live approved service counts grouped by category_id
      const { data: counts, error: countError } = await supabase
        .from("services")
        .select("category_id")
        .eq("status", "approved");
      if (countError) throw countError;

      // Build a count map
      const countMap: Record<string, number> = {};
      for (const row of counts || []) {
        if (row.category_id) {
          countMap[row.category_id] = (countMap[row.category_id] || 0) + 1;
        }
      }

      // Merge counts into categories, only return categories with at least 1 service
      return (categories || [])
        .map((cat) => ({
          ...cat,
          service_count: countMap[cat.id] || 0,
        }))
        .filter((cat) => cat.service_count > 0);
    },
  });
}
