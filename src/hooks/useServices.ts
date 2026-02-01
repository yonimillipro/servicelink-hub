import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Service = Database["public"]["Tables"]["services"]["Row"];
type ServiceInsert = Database["public"]["Tables"]["services"]["Insert"];
type ServiceUpdate = Database["public"]["Tables"]["services"]["Update"];

export interface ServiceWithRelations extends Service {
  categories: { name: string; slug: string } | null;
  companies: { 
    id: string;
    name: string; 
    logo_url: string | null;
    location: string | null;
    verified: boolean | null;
  } | null;
}

interface UseServicesOptions {
  categorySlug?: string;
  featured?: boolean;
  status?: string;
  limit?: number;
  companyId?: string;
}

export function useServices(options: UseServicesOptions = {}) {
  const { categorySlug, featured, status = "approved", limit, companyId } = options;
  
  return useQuery({
    queryKey: ["services", options],
    queryFn: async (): Promise<ServiceWithRelations[]> => {
      let query = supabase
        .from("services")
        .select(`
          *,
          categories (name, slug),
          companies (id, name, logo_url, location, verified)
        `)
        .order("created_at", { ascending: false });

      if (status) {
        query = query.eq("status", status);
      }

      if (categorySlug) {
        query = query.eq("categories.slug", categorySlug);
      }

      if (featured) {
        query = query.eq("is_featured", true);
      }

      if (companyId) {
        query = query.eq("company_id", companyId);
      }

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return (data || []) as ServiceWithRelations[];
    },
  });
}

export function useServiceById(id: string | undefined) {
  return useQuery({
    queryKey: ["service", id],
    queryFn: async (): Promise<ServiceWithRelations | null> => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from("services")
        .select(`
          *,
          categories (name, slug),
          companies (id, name, logo_url, location, verified, description, phone, email)
        `)
        .eq("id", id)
        .maybeSingle();
      
      if (error) throw error;
      return data as ServiceWithRelations | null;
    },
    enabled: !!id,
  });
}

export function useCreateService() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (service: ServiceInsert) => {
      const { data, error } = await supabase
        .from("services")
        .insert(service)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: ServiceUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("services")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      queryClient.invalidateQueries({ queryKey: ["service", data.id] });
    },
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("services")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}
