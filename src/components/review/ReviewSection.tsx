import { useReviews, useReviewStats, useUserReview } from "@/hooks/useReviews";
import { useAuth } from "@/hooks/useAuth";
import { StarRating } from "./StarRating";
import { ReviewList } from "./ReviewList";
import { ReviewForm } from "./ReviewForm";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

interface ReviewSectionProps {
  serviceId: string;
}

export function ReviewSection({ serviceId }: ReviewSectionProps) {
  const { user } = useAuth();
  const { data: reviews, isLoading } = useReviews(serviceId);
  const { data: stats } = useReviewStats(serviceId);
  const { data: userReview } = useUserReview(serviceId, user?.id);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  return (
    <div className="mt-8 sm:mt-10">
      <div className="flex items-center gap-3 mb-6">
        <MessageSquare className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Reviews</h3>
      </div>

      {/* Stats */}
      {stats && stats.count > 0 && (
        <div className="flex items-center gap-3 mb-6 p-4 rounded-lg bg-muted/50">
          <span className="text-3xl font-bold text-foreground">{stats.average.toFixed(1)}</span>
          <div>
            <StarRating rating={Math.round(stats.average)} size="sm" />
            <p className="text-xs text-muted-foreground mt-0.5">{stats.count} review{stats.count !== 1 ? "s" : ""}</p>
          </div>
        </div>
      )}

      {/* Review Form */}
      {user ? (
        userReview ? (
          <p className="text-sm text-muted-foreground mb-6 p-3 rounded-lg bg-muted/30">
            ✓ You have already reviewed this service.
          </p>
        ) : (
          <div className="mb-6 p-4 rounded-lg border border-border">
            <h4 className="text-sm font-medium text-foreground mb-3">Write a Review</h4>
            <ReviewForm serviceId={serviceId} userId={user.id} />
          </div>
        )
      ) : (
        <p className="text-sm text-muted-foreground mb-6">
          <Link to="/login" className="text-primary hover:underline">Sign in</Link> to leave a review.
        </p>
      )}

      {/* Review List */}
      <ReviewList reviews={reviews || []} />
    </div>
  );
}
