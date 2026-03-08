import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ServiceImage {
  id: string;
  service_id: string;
  image_url: string;
  created_at: string;
}

export function useServiceImages(serviceId: string | undefined) {
  return useQuery({
    queryKey: ["service-images", serviceId],
    queryFn: async (): Promise<ServiceImage[]> => {
      if (!serviceId) return [];
      const { data, error } = await supabase
        .from("service_images")
        .select("*")
        .eq("service_id", serviceId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data || []) as ServiceImage[];
    },
    enabled: !!serviceId,
  });
}

export function useAddServiceImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ serviceId, imageUrl }: { serviceId: string; imageUrl: string }) => {
      const { data, error } = await supabase
        .from("service_images")
        .insert({ service_id: serviceId, image_url: imageUrl })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["service-images", variables.serviceId] });
    },
  });
}

export function useDeleteServiceImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, serviceId }: { id: string; serviceId: string }) => {
      const { error } = await supabase
        .from("service_images")
        .delete()
        .eq("id", id);
      if (error) throw error;
      return serviceId;
    },
    onSuccess: (serviceId) => {
      queryClient.invalidateQueries({ queryKey: ["service-images", serviceId] });
    },
  });
}

export async function uploadServiceImage(file: File, userId: string): Promise<string> {
  const ext = file.name.split(".").pop();
  const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from("service-images").upload(path, file);
  if (error) throw error;
  const { data } = supabase.storage.from("service-images").getPublicUrl(path);
  return data.publicUrl;
}
