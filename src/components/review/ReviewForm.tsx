import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { StarRating } from "./StarRating";
import { useCreateReview } from "@/hooks/useReviews";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ReviewFormProps {
  serviceId: string;
  userId: string;
}

export function ReviewForm({ serviceId, userId }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const createReview = useCreateReview();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) { toast.error("Please select a rating"); return; }
    if (comment.trim().length < 5) { toast.error("Comment must be at least 5 characters"); return; }
    try {
      await createReview.mutateAsync({ service_id: serviceId, user_id: userId, rating, comment: comment.trim() });
      toast.success("Review submitted!");
      setRating(0);
      setComment("");
    } catch (error: any) {
      toast.error(error.message || "Failed to submit review");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label className="text-sm">Your Rating *</Label>
        <div className="mt-1">
          <StarRating rating={rating} interactive onRate={setRating} />
        </div>
      </div>
      <div>
        <Label htmlFor="review-comment" className="text-sm">Your Review *</Label>
        <Textarea
          id="review-comment"
          rows={3}
          className="mt-1"
          placeholder="Share your experience..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />
      </div>
      <Button type="submit" size="sm" disabled={createReview.isPending}>
        {createReview.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Submit Review
      </Button>
    </form>
  );
}
