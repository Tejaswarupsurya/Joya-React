import { api } from "./axios";

export type ToggleWishlistResponse = {
  success: boolean;
  action?: "added" | "removed";
  message?: string;
};

export const toggleWishlist = async (
  listingId: string,
): Promise<ToggleWishlistResponse> => {
  const response = await api.post<ToggleWishlistResponse>(
    `/wishlist/toggle/${listingId}`,
  );

  return response.data;
};
