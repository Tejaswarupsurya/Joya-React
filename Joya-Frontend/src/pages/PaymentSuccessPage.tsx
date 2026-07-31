import { useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { getPaymentSuccess } from "../api/bookings";
import PaymentStatusSkeleton from "../components/payments/PaymentStatusSkeleton";

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id") || "";

  const successQuery = useQuery({
    queryKey: ["paymentSuccess", sessionId],
    queryFn: () => getPaymentSuccess(sessionId),
    enabled: Boolean(sessionId),
  });

  if (!sessionId) {
    return (
      <div className="container mt-5 text-center py-5">
        <div className="alert alert-warning">No payment session found.</div>
        <Link to="/listings" className="btn btn-color mt-3">
          Browse Listings
        </Link>
      </div>
    );
  }

  if (successQuery.isLoading) {
    return <PaymentStatusSkeleton />;
  }

  if (successQuery.isError || !successQuery.data?.booking) {
    return (
      <div className="container mt-5 text-center py-5">
        <div className="alert alert-danger">
          {successQuery.error instanceof AxiosError &&
          successQuery.error.response?.data?.message
            ? successQuery.error.response.data.message
            : "Failed to retrieve payment details."}
        </div>
        <Link to="/listings" className="btn btn-color mt-3">
          Browse Listings
        </Link>
      </div>
    );
  }

  const { booking } = successQuery.data;

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-lg-7 col-md-9">
          <div className="card border-0 shadow-sm" style={{ borderRadius: "15px" }}>
            <div className="card-body p-4 p-md-5">
              {/* Success Icon */}
              <div className="text-center mb-4">
                <i
                  className="bi bi-check-circle-fill text-success"
                  style={{ fontSize: "4rem" }}
                />
              </div>

              {/* Success Message */}
              <h2 className="text-center mb-2">Payment Successful!</h2>
              <p className="text-center text-muted mb-4">
                Your booking has been confirmed. You will receive a confirmation
                email shortly.
              </p>

              {/* Booking Details Card */}
              <div className="bg-light rounded p-4 mb-4">
                <h5 className="mb-3">
                  <i className="bi bi-house-door me-2" />
                  Booking Details
                </h5>

                <div className="mb-2 d-flex justify-content-between">
                  <span className="text-muted">Property:</span>
                  <strong className="text-end">{booking.listing?.title}</strong>
                </div>

                <div className="mb-2 d-flex justify-content-between">
                  <span className="text-muted">Check-in:</span>
                  <strong>
                    {new Date(booking.checkIn).toLocaleDateString("en-IN")}
                  </strong>
                </div>

                <div className="mb-2 d-flex justify-content-between">
                  <span className="text-muted">Check-out:</span>
                  <strong>
                    {new Date(booking.checkOut).toLocaleDateString("en-IN")}
                  </strong>
                </div>

                <div className="mb-3 d-flex justify-content-between">
                  <span className="text-muted">Guests:</span>
                  <strong>{booking.guests}</strong>
                </div>

                <hr className="my-3" />

                <div className="mb-2 d-flex justify-content-between">
                  <span className="text-muted">Total Paid:</span>
                  <strong className="text-success fs-5">
                    &#8377;{booking.totalPrice?.toLocaleString("en-IN")}
                  </strong>
                </div>

                <div className="d-flex justify-content-between">
                  <span className="text-muted small">Booking ID:</span>
                  <span className="text-muted small">{booking._id}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-grid gap-2 d-md-flex justify-content-md-center mb-3">
                {booking.listing?._id && (
                  <Link
                    to={`/listings/${booking.listing._id}/bookings/${booking._id}`}
                    className="btn btn-color"
                  >
                    <i className="bi bi-receipt me-2" />
                    View Booking Details
                  </Link>
                )}
                <Link to="/listings" className="btn btn-outline-secondary">
                  <i className="bi bi-search me-2" />
                  Browse Listings
                </Link>
              </div>

              {/* Payment Info */}
              <p className="text-center text-muted small mb-0">
                <i className="bi bi-shield-check me-1" />
                Payment processed securely by Stripe
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
