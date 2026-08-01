import { api } from "./axios";
import type {
  NewBookingDetailsResponse,
  CreateCheckoutSessionPayload,
  CheckoutSessionResponse,
  BookingDetailResponse,
  PaymentSuccessResponse,
  PaymentCancelResponse,
} from "../types/booking";

export const getNewBookingDetails = async (
  listingId: string
): Promise<NewBookingDetailsResponse> => {
  const response = await api.get<NewBookingDetailsResponse>(
    `/listings/${listingId}/bookings/new`
  );
  return response.data;
};

export const createCheckoutSession = async (
  payload: CreateCheckoutSessionPayload
): Promise<CheckoutSessionResponse> => {
  const response = await api.post<CheckoutSessionResponse>(
    "/payments/create-checkout-session",
    payload
  );
  return response.data;
};

export const getBookingById = async (
  listingId: string,
  bookingId: string
): Promise<BookingDetailResponse> => {
  const response = await api.get<BookingDetailResponse>(
    `/listings/${listingId}/bookings/${bookingId}`
  );
  return response.data;
};

export const cancelBooking = async (
  listingId: string,
  bookingId: string
): Promise<{ success: boolean; message: string }> => {
  const response = await api.put<{ success: boolean; message: string }>(
    `/listings/${listingId}/bookings/${bookingId}/cancel`
  );
  return response.data;
};

export const getPaymentSuccess = async (
  sessionId: string
): Promise<PaymentSuccessResponse> => {
  const response = await api.get<PaymentSuccessResponse>(
    `/payments/success?session_id=${sessionId}`
  );
  return response.data;
};

export const getPaymentCancel = async (
  bookingId: string
): Promise<PaymentCancelResponse> => {
  const response = await api.get<PaymentCancelResponse>(
    `/payments/cancel?booking_id=${bookingId}`
  );
  return response.data;
};

export const resumeCheckoutSession = async (
  bookingId: string
): Promise<CheckoutSessionResponse> => {
  const response = await api.post<CheckoutSessionResponse>(
    `/payments/resume-checkout/${bookingId}`
  );
  return response.data;
};
