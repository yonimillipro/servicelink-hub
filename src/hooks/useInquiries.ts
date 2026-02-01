import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Inquiry = Database["public"]["Tables"]["inquiries"]["Row"];
type InquiryInsert = Database["public"]["Tables"]["inquiries"]["Insert"];

export interface InquiryWithService extends Inquiry {
  services: {
    id: string;
    title: string;
    image: string | null;
  } | null;
}

export function useInquiriesForProvider() {
  return useQuery({
    queryKey: ["provider-inquiries"],
    queryFn: async (): Promise<InquiryWithService[]> => {
      const { data, error } = await supabase
        .from("inquiries")
        .select(`
          *,
          services (id, title, image)
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return (data || []) as InquiryWithService[];
    },
  });
}

export function useCreateInquiry() {
  return useMutation({
    mutationFn: async (inquiry: InquiryInsert) => {
      const { data, error } = await supabase
        .from("inquiries")
        .insert(inquiry)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
  });
}

export function useUpdateInquiryStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data, error } = await supabase
        .from("inquiries")
        .update({ status })
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provider-inquiries"] });
    },
  });
}
