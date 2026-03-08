import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export function useSavedServices() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["saved-services", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("saved_services")
        .select("service_id")
        .eq("user_id", user.id);
      if (error) throw error;
      return (data || []).map((r) => r.service_id);
    },
    enabled: !!user,
  });
}

export function useToggleSave() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ serviceId, isSaved }: { serviceId: string; isSaved: boolean }) => {
      if (!user) throw new Error("Must be logged in");
      if (isSaved) {
        const { error } = await supabase
          .from("saved_services")
          .delete()
          .eq("user_id", user.id)
          .eq("service_id", serviceId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("saved_services")
          .insert({ user_id: user.id, service_id: serviceId });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-services"] });
    },
  });
}
