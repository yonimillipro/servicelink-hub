import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Review {
  id: string;
  service_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  profiles: { full_name: string | null; avatar_url: string | null } | null;
}

export interface ReviewStats {
  average: number;
  count: number;
}

export function useReviews(serviceId: string | undefined) {
  return useQuery({
    queryKey: ["reviews", serviceId],
    queryFn: async (): Promise<Review[]> => {
      if (!serviceId) return [];
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("service_id", serviceId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      const reviews = data || [];
      
      // Fetch profile data for reviewers
      if (reviews.length === 0) return [];
      const userIds = [...new Set(reviews.map((r) => r.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .in("id", userIds);
      
      const profileMap = new Map((profiles || []).map((p) => [p.id, p]));
      return reviews.map((r) => ({
        ...r,
        profiles: profileMap.get(r.user_id) ? {
          full_name: profileMap.get(r.user_id)!.full_name,
          avatar_url: profileMap.get(r.user_id)!.avatar_url,
        } : null,
      })) as Review[];
    },
    enabled: !!serviceId,
  });
}

export function useReviewStats(serviceId: string | undefined) {
  return useQuery({
    queryKey: ["review-stats", serviceId],
    queryFn: async (): Promise<ReviewStats> => {
      if (!serviceId) return { average: 0, count: 0 };
      const { data, error } = await supabase
        .from("reviews")
        .select("rating")
        .eq("service_id", serviceId);
      if (error) throw error;
      const ratings = data || [];
      if (ratings.length === 0) return { average: 0, count: 0 };
      const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
      return { average: sum / ratings.length, count: ratings.length };
    },
    enabled: !!serviceId,
  });
}

export function useUserReview(serviceId: string | undefined, userId: string | undefined) {
  return useQuery({
    queryKey: ["user-review", serviceId, userId],
    queryFn: async () => {
      if (!serviceId || !userId) return null;
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("service_id", serviceId)
        .eq("user_id", userId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!serviceId && !!userId,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (review: { service_id: string; user_id: string; rating: number; comment: string }) => {
      const { data, error } = await supabase
        .from("reviews")
        .insert(review)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reviews", variables.service_id] });
      queryClient.invalidateQueries({ queryKey: ["review-stats", variables.service_id] });
      queryClient.invalidateQueries({ queryKey: ["user-review", variables.service_id] });
    },
  });
}
