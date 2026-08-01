import { Link, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

import { getBookingById, cancelBooking, resumeCheckoutSession } from "../api/bookings";
import ListingMap from "../components/listings/ListingMap";
import BookingDetailSkeleton from "../components/bookings/BookingDetailSkeleton";
import "./BookingDetailPage.css";

export default function BookingDetailPage() {
  const { id, bookingId } = useParams<{ id: string; bookingId: string }>();
  const queryClient = useQueryClient();

  const bookingQuery = useQuery({
    queryKey: ["bookingDetail", id, bookingId],
    queryFn: () => getBookingById(id!, bookingId!),
    enabled: Boolean(id && bookingId),
  });

  const cancelMutation = useMutation({
    mutationFn: () => cancelBooking(id!, bookingId!),
    onSuccess: (data) => {
      toast.success(data.message || "Booking cancelled successfully!");
      queryClient.invalidateQueries({ queryKey: ["bookingDetail", id, bookingId] });
    },
    onError: (err) => {
      if (err instanceof AxiosError && err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Failed to cancel booking.");
      }
    },
  });

  const resumeMutation = useMutation({
    mutationFn: () => resumeCheckoutSession(bookingId!),
    onSuccess: (data) => {
      if (data.sessionUrl) {
        window.location.href = data.sessionUrl;
      } else {
        toast.error("Failed to retrieve payment link.");
      }
    },
    onError: (err) => {
      if (err instanceof AxiosError && err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Failed to initiate payment.");
      }
    },
  });

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      cancelMutation.mutate();
    }
  };

  const handlePayNow = () => {
    resumeMutation.mutate();
  };

  if (bookingQuery.isLoading) {
    return <BookingDetailSkeleton />;
  }

  if (bookingQuery.isError || !bookingQuery.data?.booking) {
    return (
      <div className="container mt-5 text-center py-5">
        <div className="alert alert-danger">
          {bookingQuery.error instanceof AxiosError &&
          bookingQuery.error.response?.data?.message
            ? bookingQuery.error.response.data.message
            : "Booking not found!"}
        </div>
        <Link to="/listings" className="btn btn-color mt-3">
          Back to Listings
        </Link>
      </div>
    );
  }

  const { booking } = bookingQuery.data;
  const listing = booking.listing;

  const statusBadgeClass =
    booking.status === "confirmed"
      ? "bg-success"
      : booking.status === "pending" || booking.status === "pending_payment"
      ? "bg-warning text-dark"
      : "bg-danger";

  return (
    <div className="container mt-3">
      <div className="col-12 col-md-8 offset-md-2">
        <h3 className="mb-3">Your Booking</h3>

        {/* Booking Summary Card */}
        <div className="card booking-card mb-3">
          {listing?.image?.url && (
            <img
              src={listing.image.url}
              className="card-img-top show-img"
              alt={listing.title}
              loading="lazy"
            />
          )}

          <div className="card-body">
            <h4 className="card-title mb-2">{listing?.title}</h4>
            <p className="card-text text-muted mb-2">
              Owned by: <i>{listing?.owner?.username || "Host"}</i>
            </p>

            <p className="card-text mb-1">
              <i className="bi bi-calendar-check-fill me-1 text-success" />
              <b>Check-In:</b> {new Date(booking.checkIn).toDateString()}
            </p>

            <p className="card-text mb-1">
              <i className="bi bi-calendar-x-fill me-1 text-danger" />
              <b>Check-Out:</b> {new Date(booking.checkOut).toDateString()}
            </p>

            <p className="card-text mb-1">
              <i className="bi bi-people-fill me-1 text-muted" />
              <b>Guests:</b> {booking.guests}
            </p>

            <hr />

            <div className="d-flex align-items-center justify-content-between">
              <p className="card-text listing-price mb-0 fw-bold fs-5">
                <i className="bi bi-currency-rupee text-warning" />
                {booking.totalPrice?.toLocaleString("en-IN")}
              </p>
              <span className={`booking-status-badge ${statusBadgeClass}`}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="d-flex justify-content-between align-items-center mt-3 mb-2 gap-2">
          {booking.status === "pending_payment" && (
            <button
              type="button"
              className="btn btn-warning flex-grow-1"
              onClick={handlePayNow}
              disabled={resumeMutation.isPending}
            >
              <i className="bi bi-credit-card-fill me-2" />
              {resumeMutation.isPending ? "Redirecting..." : "Pay Now (Complete Payment)"}
            </button>
          )}

          {booking.status !== "cancelled" && booking.status !== "expired" && (
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={handleCancel}
              disabled={cancelMutation.isPending}
            >
              <i className="bi bi-x-circle me-1" />
              {cancelMutation.isPending ? "Cancelling..." : "Cancel Booking"}
            </button>
          )}
        </div>

        {/* Go Back Button */}
        <div className="text-start mb-4">
          <Link to={`/listings/${id}`} className="text-muted go-back">
            <i className="bi bi-arrow-left me-1" />
            Back to Listing
          </Link>
        </div>

        {/* Map Section */}
        {listing?.geometry?.coordinates && (
          <div className="mb-4">
            <hr />
            <h3 className="mb-2">
              <i className="bi bi-geo-alt-fill me-1" />
              Your Destination
            </h3>
            <ListingMap
              coordinates={listing.geometry.coordinates}
              title={listing.title}
              location={listing.location}
              country={listing.country}
            />
          </div>
        )}
      </div>
    </div>
  );
}
