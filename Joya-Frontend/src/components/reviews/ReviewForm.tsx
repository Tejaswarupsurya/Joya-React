import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { createReview } from "../../api/reviews";
import type { CurrentUser } from "../../types/user";
import "./ReviewForm.css";

type ReviewFormProps = {
  listingId: string;
  currentUser?: CurrentUser | null;
};

export default function ReviewForm({ listingId, currentUser }: ReviewFormProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [validated, setValidated] = useState<boolean>(false);

  const createReviewMutation = useMutation({
    mutationFn: (reviewData: { rating: number; comment: string }) =>
      createReview(listingId, reviewData),
    onSuccess: (data) => {
      toast.success(data.message || "Review Added!");
      setComment("");
      setRating(0);
      setValidated(false);
      queryClient.invalidateQueries({ queryKey: ["listing", listingId] });
    },
    onError: (err) => {
      if (err instanceof AxiosError && err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Failed to submit review.");
      }
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!currentUser) {
      toast.info("Please sign up or log in to add a review!");
      navigate("/signup");
      return;
    }

    if (rating === 0 || !comment.trim()) {
      setValidated(true);
      return;
    }

    setValidated(true);
    createReviewMutation.mutate({ rating, comment: comment.trim() });
  };

  return (
    <>
      <hr />
      <h3 className="mb-2">Write a Review</h3>
      <form
        noValidate
        className={`needs-validation ${validated ? "was-validated" : ""}`}
        onSubmit={handleSubmit}
      >
        <div className="mb-0 mt-2">
          <label htmlFor="rating" className="form-label">
            Rating
          </label>
          <fieldset className="starability-slot">
            <input
              type="radio"
              id="no-rate"
              className="input-no-rate"
              name="rating"
              value="1"
              checked={rating === 0}
              onChange={() => setRating(0)}
              aria-label="No rating."
            />
            <input
              type="radio"
              id="first-rate1"
              name="rating"
              value="1"
              checked={rating === 1}
              onChange={() => setRating(1)}
            />
            <label htmlFor="first-rate1" title="Terrible">
              1 star
            </label>
            <input
              type="radio"
              id="first-rate2"
              name="rating"
              value="2"
              checked={rating === 2}
              onChange={() => setRating(2)}
            />
            <label htmlFor="first-rate2" title="Not good">
              2 stars
            </label>
            <input
              type="radio"
              id="first-rate3"
              name="rating"
              value="3"
              checked={rating === 3}
              onChange={() => setRating(3)}
            />
            <label htmlFor="first-rate3" title="Average">
              3 stars
            </label>
            <input
              type="radio"
              id="first-rate4"
              name="rating"
              value="4"
              checked={rating === 4}
              onChange={() => setRating(4)}
            />
            <label htmlFor="first-rate4" title="Very good">
              4 stars
            </label>
            <input
              type="radio"
              id="first-rate5"
              name="rating"
              value="5"
              checked={rating === 5}
              onChange={() => setRating(5)}
            />
            <label htmlFor="first-rate5" title="Amazing">
              5 stars
            </label>
          </fieldset>
          {validated && rating === 0 && (
            <div className="text-danger small mt-1">Please select a rating!</div>
          )}
        </div>

        <div className="mb-3 mt-0">
          <label htmlFor="comment" className="form-label">
            Comment
          </label>
          <textarea
            name="comment"
            id="comment"
            className="form-control"
            cols={30}
            rows={3}
            required
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="invalid-feedback">Add a short review!</div>
        </div>

        <button
          type="submit"
          className="btn btn-color"
          disabled={createReviewMutation.isPending}
        >
          {createReviewMutation.isPending ? "Submitting..." : "Submit"}
        </button>
      </form>
    </>
  );
}
