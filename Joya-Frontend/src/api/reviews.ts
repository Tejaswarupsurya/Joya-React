import { api } from "./axios";
import type { CreateReviewPayload, ReviewResponse } from "../types/review";

export const createReview = async (
  listingId: string,
  reviewData: CreateReviewPayload,
): Promise<ReviewResponse> => {
  const response = await api.post<ReviewResponse>(
    `/listings/${listingId}/reviews`,
    { review: reviewData },
  );

  return response.data;
};

export const deleteReview = async (
  listingId: string,
  reviewId: string,
): Promise<{ success: boolean; message: string }> => {
  const response = await api.delete<{ success: boolean; message: string }>(
    `/listings/${listingId}/reviews/${reviewId}`,
  );

  return response.data;
};
