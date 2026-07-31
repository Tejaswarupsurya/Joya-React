import type { Listing } from "./listing";
import type { CurrentUser } from "./user";

export type BookedDateRange = {
  from: string; // "YYYY-MM-DD"
  to: string;   // "YYYY-MM-DD"
};

export type ListingBookingSummary = {
  _id: string;
  title: string;
  price: number;
  image?: {
    url: string;
    filename: string;
  };
};

export type NewBookingDetailsResponse = {
  success: boolean;
  listing: ListingBookingSummary;
  bookedDates: BookedDateRange[];
};

export type CreateCheckoutSessionPayload = {
  listingId: string;
  checkIn: string;  // "YYYY-MM-DD"
  checkOut: string; // "YYYY-MM-DD"
  guests: number;
};

export type CheckoutSessionResponse = {
  sessionUrl: string;
};

export type BookingStatus = "pending" | "pending_payment" | "confirmed" | "cancelled" | "expired";

export type Booking = {
  _id: string;
  listing: Listing;
  user: CurrentUser;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: BookingStatus;
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type PaymentSuccessResponse = {
  success: boolean;
  booking: Booking;
  session?: {
    id: string;
    payment_status: string;
    amount_total: number;
  };
};

export type PaymentCancelResponse = {
  success: boolean;
  booking: Booking;
};

export type BookingDetailResponse = {
  success: boolean;
  booking: Booking;
};
