import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { deleteReview } from "../../api/reviews";
import type { Review } from "../../types/review";
import type { CurrentUser } from "../../types/user";
import "./ReviewCard.css";

type ReviewCardProps = {
  listingId: string;
  listingOwnerId?: string;
  review: Review;
  currentUser?: CurrentUser | null;
};

export default function ReviewCard({
  listingId,
  listingOwnerId,
  review,
  currentUser,
}: ReviewCardProps) {
  const queryClient = useQueryClient();

  const deleteReviewMutation = useMutation({
    mutationFn: () => deleteReview(listingId, review._id),
    onSuccess: (data) => {
      toast.success(data.message || "Review Deleted!");
      queryClient.invalidateQueries({ queryKey: ["listing", listingId] });
    },
    onError: (err) => {
      if (err instanceof AxiosError && err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Failed to delete review.");
      }
    },
  });

  const canDeleteReview =
    currentUser &&
    (review.author?._id === currentUser._id ||
      currentUser.role === "admin" ||
      (listingOwnerId && currentUser._id === listingOwnerId));

  return (
    <div
      className="card col-12 col-md-5 mb-3 ms-md-3"
      style={{ borderRadius: "20px" }}
    >
      <div className="card-body">
        <div className="d-flex align-items-center mt-2 gap-1 justify-content-between">
          <div className="d-flex align-items-center gap-1">
            <div
              className="review-avatar d-flex align-items-center justify-content-center text-white mb-1"
              title={review.author?.username}
            >
              {review.author?.username?.charAt(0).toUpperCase() || "U"}
            </div>
            <h6 className="card-title mb-1">
              {review.author?.username || "Anonymous"}
            </h6>
          </div>
          {review.createdAt && (
            <small className="text-muted review-time">
              {new Date(review.createdAt).toLocaleDateString()}
            </small>
          )}
        </div>
        <p
          className="starability-result card-text mt-1"
          data-rating={review.rating}
        />
        <p className="card-text mb-2">{review.comment}</p>

        {canDeleteReview && (
          <button
            type="button"
            className="btn btn-sm btn-dark mb-3"
            onClick={() => deleteReviewMutation.mutate()}
            disabled={deleteReviewMutation.isPending}
          >
            {deleteReviewMutation.isPending ? "Deleting..." : "Delete"}
          </button>
        )}
      </div>
    </div>
  );
}
