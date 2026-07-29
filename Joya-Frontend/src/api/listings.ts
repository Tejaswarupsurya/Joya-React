import { api } from "./axios";
import type { Listing } from "../types/listing";

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