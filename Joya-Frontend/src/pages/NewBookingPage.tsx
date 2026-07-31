import { useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.css";

import { getNewBookingDetails, createCheckoutSession } from "../api/bookings";
import type { BookedDateRange } from "../types/booking";
import "./NewBookingPage.css";

// Helper to format date object as YYYY-MM-DD
const formatDateStr = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function NewBookingPage() {
  const { id } = useParams<{ id: string }>();

  const [checkIn, setCheckIn] = useState<string>("");
  const [checkOut, setCheckOut] = useState<string>("");
  const [guests, setGuests] = useState<number>(1);
  const [validated, setValidated] = useState<boolean>(false);

  // Fetch booking details & booked date ranges
  const bookingDetailsQuery = useQuery({
    queryKey: ["newBookingDetails", id],
    queryFn: () => getNewBookingDetails(id!),
    enabled: Boolean(id),
  });

  const bookedRanges: BookedDateRange[] = useMemo(() => {
    return bookingDetailsQuery.data?.bookedDates || [];
  }, [bookingDetailsQuery.data]);

  // Flatpickr disabled dates array
  const flatpickrDisabled = useMemo(() => {
    return bookedRanges.map((r) => ({
      from: r.from,
      to: r.to,
    }));
  }, [bookedRanges]);

  // Calculate nights
  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn).getTime();
    const end = new Date(checkOut).getTime();
    const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  }, [checkIn, checkOut]);

  // Calculate total price
  const totalPrice = useMemo(() => {
    if (!bookingDetailsQuery.data?.listing?.price || nights <= 0) return 0;
    return bookingDetailsQuery.data.listing.price * nights;
  }, [bookingDetailsQuery.data, nights]);

  // Mutation to create Stripe Checkout Session
  const checkoutMutation = useMutation({
    mutationFn: () =>
      createCheckoutSession({
        listingId: id!,
        checkIn,
        checkOut,
        guests,
      }),
    onSuccess: (data) => {
      toast.success("Redirecting to payment gateway...");
      if (data.sessionUrl) {
        window.location.href = data.sessionUrl;
      }
    },
    onError: (err) => {
      if (err instanceof AxiosError && err.response?.data) {
        const msg =
          err.response.data.message ||
          err.response.data.error ||
          "Failed to initiate payment session.";
        toast.error(msg);
      } else {
        toast.error("Network error during payment checkout.");
      }
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidated(true);

    if (!checkIn || !checkOut) {
      toast.error("Please select both check-in and check-out dates.");
      return;
    }

    if (nights < 1) {
      toast.error("Check-out date must be after check-in date.");
      return;
    }

    if (nights > 14) {
      toast.error("Maximum stay duration is 14 nights.");
      return;
    }

    if (guests < 1 || guests > 6) {
      toast.error("Guests must be between 1 and 6.");
      return;
    }

    checkoutMutation.mutate();
  };

  if (bookingDetailsQuery.isLoading) {
    return (
      <div className="container mt-5 text-center py-5">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading booking details...</span>
        </div>
      </div>
    );
  }

  if (bookingDetailsQuery.isError || !bookingDetailsQuery.data?.listing) {
    return (
      <div className="container mt-5 text-center py-5">
        <div className="alert alert-danger">
          {bookingDetailsQuery.error instanceof AxiosError &&
          bookingDetailsQuery.error.response?.data?.message
            ? bookingDetailsQuery.error.response.data.message
            : "Listing not found!"}
        </div>
        <Link to="/listings" className="btn btn-color mt-3">
          Back to Listings
        </Link>
      </div>
    );
  }

  const { listing } = bookingDetailsQuery.data;

  // Min date: tomorrow
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);

  // Max date: 180 days ahead
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 180);

  return (
    <div className="container row mt-3 mx-auto">
      <div className="col-12 col-md-8 offset-md-2">
        <h3 className="mb-3">Book Your Stay at {listing.title}</h3>

        <div className="card booking-form mb-3">
          <form
            id="bookingForm"
            noValidate
            className={`needs-validation ${validated ? "was-validated" : ""}`}
            onSubmit={handleSubmit}
          >
            {/* Flatpickr Date Range Selection */}
            <div className="mb-3">
              <label htmlFor="dateRange" className="form-label">
                Select Dates
              </label>
              <Flatpickr
                id="dateRange"
                className="form-control"
                placeholder="Choose Check-In and Check-Out"
                options={{
                  mode: "range",
                  minDate: minDate,
                  maxDate: maxDate,
                  dateFormat: "Y-m-d",
                  disable: flatpickrDisabled,
                  onDayCreate: (_dObj, _dStr, _fp, dayElem) => {
                    const dateStr = formatDateStr(dayElem.dateObj);
                    const isDisabled = bookedRanges.some(
                      (r) => dateStr >= r.from && dateStr <= r.to
                    );
                    if (!isDisabled) {
                      dayElem.classList.add("available");
                      dayElem.setAttribute("data-tooltip", "Available");
                    } else {
                      dayElem.classList.add("disabled");
                      dayElem.setAttribute("data-tooltip", "Unavailable");
                    }
                  },
                  locale: {
                    rangeSeparator: " to ",
                  },
                }}
                value={checkIn && checkOut ? [checkIn, checkOut] : []}
                onChange={(selectedDates) => {
                  if (selectedDates.length === 2) {
                    const startStr = formatDateStr(selectedDates[0]);
                    const endStr = formatDateStr(selectedDates[1]);
                    setCheckIn(startStr);
                    setCheckOut(endStr);
                  } else {
                    setCheckIn("");
                    setCheckOut("");
                  }
                }}
              />
              <div className="form-text mt-2">
                <i className="bi bi-info-circle me-1" />
                Bookings available from tomorrow onwards. Maximum stay: 14 nights.
                Unavailable dates are shown in red.
              </div>
              {validated && (!checkIn || !checkOut) && (
                <div className="text-danger small mt-1">Please select valid dates.</div>
              )}
            </div>

            {/* Guests */}
            <div className="mb-3">
              <label htmlFor="guests" className="form-label">
                Guests
              </label>
              <input
                type="number"
                name="guests"
                id="guests"
                className="form-control"
                min={1}
                max={6}
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                required
              />
              <div className="form-text">Maximum 6 guests allowed</div>
              <div className="invalid-feedback">
                Please enter number of guests (1-6).
              </div>
            </div>

            {/* Price Summary */}
            {nights > 0 && totalPrice > 0 && (
              <div className="alert alert-info id='priceSummary' mb-4">
                <h6 className="alert-heading mb-2">Booking Summary</h6>
                <div className="d-flex justify-content-between align-items-center">
                  <span>
                    &#8377;{listing.price?.toLocaleString("en-IN")} &times;{" "}
                    <b>{nights}</b> night{nights > 1 ? "s" : ""}
                  </span>
                  <strong className="fs-5">
                    &#8377;{totalPrice.toLocaleString("en-IN")}
                  </strong>
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="d-flex justify-content-between align-items-center mt-4">
              <button
                type="submit"
                className="btn btn-color px-4 py-2"
                id="proceedToPayment"
                disabled={checkoutMutation.isPending}
              >
                <i className="bi bi-credit-card me-2" />
                {checkoutMutation.isPending
                  ? "Processing Payment..."
                  : "Proceed to Payment"}
              </button>
              <Link to={`/listings/${id}`} className="text-muted go-back">
                <i className="bi bi-caret-left-fill me-1" />
                Go Back
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
