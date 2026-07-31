import { api } from "./axios";
import type { Listing } from "../types/listing";

export type DashboardBooking = {
  _id: string;
  listing: Listing;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: "confirmed" | "pending_payment" | "cancelled" | "expired";
  expiresAt?: string;
  createdAt?: string;
};

export type UserDashboardStats = {
  total: number;
  active: number;
  completed: number;
  pending: number;
  cancelled: number;
};

export type UserDashboardResponse = {
  success: boolean;
  wishlist: Listing[];
  bookings: {
    active: DashboardBooking[];
    past: DashboardBooking[];
    pending: DashboardBooking[];
    cancelled: DashboardBooking[];
    expired: DashboardBooking[];
  };
  stats: UserDashboardStats;
};

export const getUserDashboard = async (): Promise<UserDashboardResponse> => {
  const response = await api.get<UserDashboardResponse>("/dashboard");
  return response.data;
};
