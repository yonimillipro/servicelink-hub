import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import type { Database } from "@/integrations/supabase/types";

type Company = Database["public"]["Tables"]["companies"]["Row"];
type CompanyInsert = Database["public"]["Tables"]["companies"]["Insert"];
type CompanyUpdate = Database["public"]["Tables"]["companies"]["Update"];

export function useCompanyById(id: string | undefined) {
  return useQuery({
    queryKey: ["company", id],
    queryFn: async (): Promise<Company | null> => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

export function useMyCompany() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["my-company", user?.id],
    queryFn: async (): Promise<Company | null> => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .eq("owner_id", user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });
}

export function useCreateCompany() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (company: CompanyInsert) => {
      const { data, error } = await supabase
        .from("companies")
        .insert(company)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-company"] });
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
}

export function useUpdateCompany() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: CompanyUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("companies")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["my-company"] });
      queryClient.invalidateQueries({ queryKey: ["company", data.id] });
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
}

export function useAllCompanies() {
  return useQuery({
    queryKey: ["companies"],
    queryFn: async (): Promise<Company[]> => {
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
}
