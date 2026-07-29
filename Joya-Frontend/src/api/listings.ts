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
};

export const getListings = async (
  params: ListingsParams,
): Promise<ListingsResponse> => {
  const response = await api.get<ListingsResponse>("/listings", {
    params,
  });

  return response.data;
};