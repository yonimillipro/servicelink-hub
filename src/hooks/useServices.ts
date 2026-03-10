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
  status?: string | null;
  limit?: number;
  companyId?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedServices {
  data: ServiceWithRelations[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export function useServices(options: UseServicesOptions = {}) {
  const { categorySlug, featured, status = "approved", limit, companyId, page = 1, pageSize = 12 } = options;
  const statusFilter = status === undefined ? "approved" : status;

  return useQuery({
    queryKey: ["services", options],
    queryFn: async (): Promise<PaginatedServices> => {
      // Resolve categorySlug to categoryId inline
      let categoryId: string | undefined;
      if (categorySlug) {
        const { data: catData } = await supabase
          .from("categories")
          .select("id")
          .eq("slug", categorySlug)
          .maybeSingle();
        categoryId = catData?.id;
        if (!categoryId) {
          return { data: [], count: 0, page, pageSize, totalPages: 0 };
        }
      }

      let query = supabase
        .from("services")
        .select(`
          *,
          categories (name, slug),
          companies (id, name, logo_url, location, verified)
        `, { count: "exact" })
        .order("created_at", { ascending: false });

      if (statusFilter) {
        query = query.eq("status", statusFilter);
      }

      if (categoryId) {
        query = query.eq("category_id", categoryId);
      }

      if (featured) {
        query = query.eq("is_featured", true);
      }

      if (companyId) {
        query = query.eq("company_id", companyId);
      }

      if (limit) {
        query = query.limit(limit);
      } else {
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;
        query = query.range(from, to);
      }

      const { data, error, count } = await query;

      if (error) throw error;
      const total = count ?? 0;
      return {
        data: (data || []) as ServiceWithRelations[],
        count: total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      };
    },
  });
}

interface UseSearchServicesOptions {
  query?: string;
  location?: string;
  categorySlug?: string;
  featured?: boolean;
  page?: number;
  pageSize?: number;
}

export function useSearchServices(options: UseSearchServicesOptions = {}) {
  const { query, location, categorySlug, featured, page = 1, pageSize = 12 } = options;
  
  // We need category ID from slug
  const categoryQuery = useQuery({
    queryKey: ["category-by-slug", categorySlug],
    queryFn: async () => {
      if (!categorySlug) return null;
      const { data } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", categorySlug)
        .maybeSingle();
      return data;
    },
    enabled: !!categorySlug,
  });

  const categoryId = categoryQuery.data?.id ?? undefined;

  return useQuery({
    queryKey: ["search-services", query, location, categorySlug, categoryId, featured, page, pageSize],
    queryFn: async (): Promise<PaginatedServices> => {
      const { data, error } = await (supabase.rpc as any)("search_services", {
        search_query: query || null,
        search_location: location || null,
        filter_category_id: categoryId || null,
        filter_status: "approved",
        filter_featured: featured ?? null,
        filter_company_id: null,
        result_limit: pageSize,
        result_offset: (page - 1) * pageSize,
      });

      if (error) throw error;

      const rows = (data as any[]) || [];
      const totalCount = rows.length > 0 ? Number(rows[0].total_count) : 0;

      const mapped: ServiceWithRelations[] = rows.map((r: any) => ({
        id: r.id,
        title: r.title,
        description: r.description,
        price: r.price,
        price_type: r.price_type,
        location: r.location,
        image: r.image,
        status: r.status,
        is_featured: r.is_featured,
        category_id: r.category_id,
        company_id: r.company_id,
        created_at: r.created_at,
        updated_at: r.updated_at,
        categories: r.category_name ? { name: r.category_name, slug: r.category_slug } : null,
        companies: r.company_name ? {
          id: r.company_id,
          name: r.company_name,
          logo_url: r.company_logo_url,
          location: r.company_location,
          verified: r.company_verified,
        } : null,
      }));

      return {
        data: mapped,
        count: totalCount,
        page,
        pageSize,
        totalPages: Math.ceil(totalCount / pageSize),
      };
    },
    enabled: categorySlug ? !!categoryId || !categorySlug : true,
  });
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function useServiceById(id: string | undefined) {
  return useQuery({
    queryKey: ["service", id],
    queryFn: async (): Promise<ServiceWithRelations | null> => {
      if (!id) return null;
      if (!UUID_REGEX.test(id)) return null;
      
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
    retry: false,
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
