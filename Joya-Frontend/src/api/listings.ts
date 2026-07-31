import { api } from "./axios";
import type { Listing, ListingDetailResponse } from "../types/listing";

type ListingsResponse = {
  success: boolean;
  data: {
    listings: Listing[];
    totalResults: number;
  };
};

type ListingsParams = {
  q?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  facilities?: string[];
  sortBy?: string;
};

export const getListings = async (
  params: ListingsParams,
): Promise<ListingsResponse> => {
  const response = await api.get<ListingsResponse>("/listings", {
    params,
    paramsSerializer: {
      indexes: null,
    },
  });

  return response.data;
};

export const getListingById = async (
  id: string,
): Promise<ListingDetailResponse> => {
  const response = await api.get<ListingDetailResponse>(`/listings/${id}`);
  return response.data;
};

export const deleteListing = async (
  id: string,
): Promise<{ success: boolean; message: string }> => {
  const response = await api.delete<{ success: boolean; message: string }>(
    `/listings/${id}`,
  );
  return response.data;
};