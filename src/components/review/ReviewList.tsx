import type { Review } from "@/hooks/useReviews";
import { StarRating } from "./StarRating";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ReviewListProps {
  reviews: Review[];
}

export function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return <p className="text-sm text-muted-foreground py-4">No reviews yet. Be the first to review!</p>;
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => {
        const name = review.profiles?.full_name || "Anonymous";
        const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
        return (
          <div key={review.id} className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-start gap-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src={review.profiles?.avatar_url || undefined} />
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-foreground truncate">{name}</span>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                <StarRating rating={review.rating} size="sm" />
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
