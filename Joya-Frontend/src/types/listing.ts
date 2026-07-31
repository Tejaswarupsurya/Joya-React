import type { Review } from "./review";

export type ListingOwner = {
  _id: string;
  username: string;
  email?: string;
};

export type ListingGeometry = {
  type: string;
  coordinates: [number, number];
};

export type Listing = {
  _id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  country: string;
  category: string;
  facilities?: string[];
  owner?: ListingOwner;
  reviews?: Review[];
  geometry?: ListingGeometry;
  image: {
    url: string;
    filename: string;
  };
  avgRating?: number;
};

export type ListingDetailResponse = {
  success: boolean;
  listing: Listing;
};
