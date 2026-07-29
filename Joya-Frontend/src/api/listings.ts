import { api } from "./axios"
import type { Listing } from "../types/listing";

type ListingsResponse = {
  success: boolean;
  data: {
    listings: Listing[];
    totalResults: number;
  };
};

export const getListings = async (): Promise<ListingsResponse> => {
  const response = await api.get<ListingsResponse>("/listings");

  return response.data;
};
