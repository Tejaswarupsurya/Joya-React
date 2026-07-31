import { useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPaymentCancel } from "../api/bookings";
import PaymentStatusSkeleton from "../components/payments/PaymentStatusSkeleton";

export default function PaymentCancelPage() {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("booking_id") || "";

  const cancelQuery = useQuery({
    queryKey: ["paymentCancel", bookingId],
    queryFn: () => getPaymentCancel(bookingId),
    enabled: Boolean(bookingId),
  });

  if (cancelQuery.isLoading) {
    return <PaymentStatusSkeleton />;
  }

  const booking = cancelQuery.data?.booking;

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-lg-7 col-md-9">
          <div className="card border-0 shadow-sm" style={{ borderRadius: "15px" }}>
            <div className="card-body p-4 p-md-5">
              {/* Cancel Icon */}
              <div className="text-center mb-4">
                <i
                  className="bi bi-x-circle-fill text-warning"
                  style={{ fontSize: "4rem" }}
                />
              </div>

              {/* Cancel Message */}
              <h2 className="text-center mb-2">Payment Cancelled</h2>
              <p className="text-center text-muted mb-4">
                Your payment was not completed and the booking has been cancelled.
              </p>

              {/* Booking Details Card */}
              {booking && (
                <div className="bg-light rounded p-4 mb-4">
                  <h5 className="mb-3">
                    <i className="bi bi-info-circle me-2" />
                    Cancelled Booking
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

                  <div className="mb-2 d-flex justify-content-between">
                    <span className="text-muted">Guests:</span>
                    <strong>{booking.guests}</strong>
                  </div>

                  <hr className="my-3" />

                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Amount:</span>
                    <span className="text-decoration-line-through text-muted">
                      &#8377;{booking.totalPrice?.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              )}

              {/* What's Next */}
              <div className="bg-light rounded p-4 mb-4">
                <h6 className="mb-3">
                  <i className="bi bi-lightbulb me-2" />
                  What's next?
                </h6>
                <ul className="mb-0 small">
                  <li>No charges were made to your card</li>
                  <li>You can try booking again anytime</li>
                  <li>The dates you selected may still be available</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="d-grid gap-2 d-md-flex justify-content-md-center mb-3">
                {booking?.listing?._id && (
                  <Link
                    to={`/listings/${booking.listing._id}/bookings/new`}
                    className="btn btn-color"
                  >
                    <i className="bi bi-arrow-clockwise me-2" />
                    Try Again
                  </Link>
                )}
                <Link to="/listings" className="btn btn-outline-secondary">
                  <i className="bi bi-search me-2" />
                  Browse Listings
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
