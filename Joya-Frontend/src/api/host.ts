import { api } from "./axios";
import type { Listing } from "../types/listing";

export type HostBookingUser = {
  _id?: string;
  username?: string;
  email?: string;
};

export type HostBooking = {
  _id: string;
  listing?: Listing;
  user?: HostBookingUser;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: "confirmed" | "pending_payment" | "cancelled" | "expired";
  expiresAt?: string;
  createdAt?: string;
};

export type HostDashboardStats = {
  totalListings: number;
  activeBookings: number;
  pendingBookings: number;
  completedBookings: number;
  totalEarnings: number;
  monthlyEarnings: number;
  occupancyRate: number;
};

export type HostDashboardResponse = {
  success: boolean;
  listings: Listing[];
  bookings: {
    active: HostBooking[];
    pending: HostBooking[];
    completed: HostBooking[];
    recent: HostBooking[];
  };
  stats: HostDashboardStats;
};

export const getHostDashboard = async (): Promise<HostDashboardResponse> => {
  const response = await api.get<HostDashboardResponse>("/host/dashboard");
  return response.data;
};

export type ApplyAsHostResponse = {
  success: boolean;
  message: string;
};

export const applyAsHost = async (
  formData: FormData
): Promise<ApplyAsHostResponse> => {
  // No explicit Content-Type header — browser sets multipart/form-data + boundary automatically
  const response = await api.post<ApplyAsHostResponse>("/apply", formData);
  return response.data;
};
