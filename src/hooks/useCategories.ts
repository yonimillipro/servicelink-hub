import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Category = Database["public"]["Tables"]["categories"]["Row"];
type CategoryInsert = Database["public"]["Tables"]["categories"]["Insert"];
type CategoryUpdate = Database["public"]["Tables"]["categories"]["Update"];

export interface CategoryWithLiveCount extends Omit<Category, "service_count"> {
  service_count: number;
}

// Original hook — used internally, returns raw DB rows
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

// Public hook — only categories that have at least 1 APPROVED service, with live count
export function useCategoriesWithCount() {
  return useQuery({
    queryKey: ["categories-with-count"],
    queryFn: async (): Promise<CategoryWithLiveCount[]> => {
      const { data: categories, error: catError } = await supabase
        .from("categories")
        .select("*")
        .order("name");
      if (catError) throw catError;

      const { data: services, error: svcError } = await supabase
        .from("services")
        .select("category_id")
        .eq("status", "approved");
      if (svcError) throw svcError;

      const countMap: Record<string, number> = {};
      for (const row of services || []) {
        if (row.category_id) {
          countMap[row.category_id] = (countMap[row.category_id] || 0) + 1;
        }
      }

      return (categories || [])
        .map((cat) => ({ ...cat, service_count: countMap[cat.id] || 0 }))
        .filter((cat) => cat.service_count > 0);
    },
  });
}

// Admin hook — ALL categories with count of ALL services (any status)
export function useCategoriesWithLiveCount() {
  return useQuery({
    queryKey: ["categories-with-live-count"],
    queryFn: async (): Promise<CategoryWithLiveCount[]> => {
      const { data: categories, error: catError } = await supabase
        .from("categories")
        .select("*")
        .order("name");
      if (catError) throw catError;

      const { data: services, error: svcError } = await supabase
        .from("services")
        .select("category_id");
      if (svcError) throw svcError;

      const countMap: Record<string, number> = {};
      for (const row of services || []) {
        if (row.category_id) {
          countMap[row.category_id] = (countMap[row.category_id] || 0) + 1;
        }
      }

      return (categories || []).map((cat) => ({
        ...cat,
        service_count: countMap[cat.id] || 0,
      }));
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
      queryClient.invalidateQueries({ queryKey: ["categories-with-count"] });
      queryClient.invalidateQueries({ queryKey: ["categories-with-live-count"] });
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
      queryClient.invalidateQueries({ queryKey: ["categories-with-count"] });
      queryClient.invalidateQueries({ queryKey: ["categories-with-live-count"] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories-with-count"] });
      queryClient.invalidateQueries({ queryKey: ["categories-with-live-count"] });
    },
  });
}
