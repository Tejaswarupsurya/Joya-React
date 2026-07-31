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

export type EditListingResponse = {
  success: boolean;
  listing: Listing;
  originalImageUrl?: string;
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

export const getEditListing = async (
  id: string,
): Promise<EditListingResponse> => {
  const response = await api.get<EditListingResponse>(`/listings/${id}/edit`);
  return response.data;
};

export const updateListing = async (
  id: string,
  formData: FormData,
): Promise<{ success: boolean; message: string; listing: Listing }> => {
  const response = await api.put<{
    success: boolean;
    message: string;
    listing: Listing;
  }>(`/listings/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
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