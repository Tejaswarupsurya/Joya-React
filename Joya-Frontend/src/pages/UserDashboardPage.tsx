import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation, Navigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

import { useAuth } from "../hooks/useAuth";
import { getUserDashboard } from "../api/user";
import { toggleWishlist } from "../api/wishlist";
import { resumeCheckoutSession } from "../api/bookings";
import "./UserDashboardPage.css";

function PendingCountdown({ expiresAt }: { expiresAt: string }) {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
  }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const diff = new Date(expiresAt).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, isExpired: true });
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ hours, minutes, seconds, isExpired: false });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  if (timeLeft.isExpired) {
    return <span className="text-danger fw-bold">Expired</span>;
  }

  const colorClass =
    timeLeft.hours < 2
      ? "text-danger fw-bold"
      : timeLeft.hours < 6
      ? "text-warning fw-bold"
      : "text-primary fw-bold";

  let formattedString: string;
  if (timeLeft.hours > 0) {
    formattedString = `${timeLeft.hours} hr${timeLeft.hours > 1 ? "s" : ""} ${timeLeft.minutes} min${timeLeft.minutes > 1 ? "s" : ""}`;
  } else if (timeLeft.minutes > 0) {
    formattedString = `${timeLeft.minutes} min${timeLeft.minutes > 1 ? "s" : ""} ${timeLeft.seconds} sec${timeLeft.seconds > 1 ? "s" : ""}`;
  } else {
    formattedString = `${timeLeft.seconds} sec${timeLeft.seconds > 1 ? "s" : ""}`;
  }

  return (
    <span className={`countdown-timer ${colorClass}`}>
      {formattedString} remaining
    </span>
  );
}

export default function UserDashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const { data: authData, isLoading: authLoading } = useAuth();
  const currentUser = authData?.currentUser;

  const [visiblePastCount, setVisiblePastCount] = useState<number>(6);
  const [showCancelled, setShowCancelled] = useState<boolean>(false);

  const dashboardQuery = useQuery({
    queryKey: ["userDashboard"],
    queryFn: getUserDashboard,
    enabled: Boolean(currentUser && currentUser.role === "user"),
  });

  useEffect(() => {
    if (location.hash === "#wishlist") {
      const timer = setTimeout(() => {
        const wishlistSection = document.getElementById("wishlistContainer");
        if (wishlistSection) {
          wishlistSection.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });

          const wishlistCard = wishlistSection.closest(
            ".mb-5"
          ) as HTMLElement | null;
          if (wishlistCard) {
            wishlistCard.style.transition = "all 0.3s ease";
            wishlistCard.style.transform = "scale(1.02)";
            wishlistCard.style.boxShadow = "0 8px 25px rgba(252, 56, 92, 0.15)";

            setTimeout(() => {
              wishlistCard.style.transform = "scale(1)";
              wishlistCard.style.boxShadow = "";
            }, 1000);
          }
        }
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [location.hash, dashboardQuery.data]);

  const removeWishlistMutation = useMutation({
    mutationFn: (listingId: string) => toggleWishlist(listingId),
    onSuccess: (data) => {
      toast.success(data.message || "Updated Wishlist");
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      queryClient.invalidateQueries({ queryKey: ["userDashboard"] });
    },
    onError: () => {
      toast.error("Failed to update wishlist.");
    },
  });

  const resumeCheckoutMutation = useMutation({
    mutationFn: (bookingId: string) => resumeCheckoutSession(bookingId),
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

  if (currentUser?.role === "host") {
    return <Navigate to="/host/dashboard" replace />;
  }

  if (currentUser?.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (authLoading || dashboardQuery.isLoading) {
    return (
      <div className="container mt-5 text-center py-5">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (dashboardQuery.isError || !dashboardQuery.data) {
    return (
      <div className="container mt-5 text-center py-5">
        <div className="alert alert-danger">
          {dashboardQuery.error instanceof AxiosError &&
          dashboardQuery.error.response?.data?.message
            ? dashboardQuery.error.response.data.message
            : "Failed to load dashboard."}
        </div>
        <Link to="/listings" className="btn btn-color mt-3">
          Explore Listings
        </Link>
      </div>
    );
  }

  const { bookings, stats, wishlist = [] } = dashboardQuery.data;

  return (
    <div className="container-fluid px-4 py-3">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div className="row align-items-center">
          <div className="col-md-8">
            <h1 className="mb-2">
              Welcome back, {currentUser?.username || "Traveler"}! ✈️
            </h1>
            <p className="mb-0 opacity-75">
              Ready for your next adventure? Manage your bookings and discover new
              destinations.
            </p>
          </div>
          <div className="col-md-4 text-md-end mt-3 mt-md-0">
            <Link to="/listings" className="btn find-stays-btn">
              <i className="bi bi-search me-2" />
              Explore New Stays
            </Link>
          </div>
        </div>
      </div>

      {/* Account Settings Panel */}
      <div className="mb-4">
        <div className="card shadow-sm border-0">
          <div className="card-header bg-white border-bottom">
            <div className="d-flex align-items-center">
              <i className="bi bi-person-gear me-2 text-primary fs-5" />
              <h5 className="mb-0">Account Settings</h5>
            </div>
          </div>
          <div className="card-body">
            <div className="row g-4">
              <div className="col-md-6">
                <div className="d-flex align-items-center p-3 bg-light rounded">
                  <div className="me-3">
                    <i className="bi bi-envelope-fill text-primary fs-4" />
                  </div>
                  <div>
                    <h6 className="mb-1">Current Email</h6>
                    <p className="mb-0 text-muted small">{currentUser?.email}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-grid gap-2">
                  <Link to="/change-email" className="btn btn-outline-primary">
                    <i className="bi bi-envelope-plus me-2" />
                    Change Email Address
                  </Link>
                  <Link to="/update-password" className="btn btn-outline-secondary">
                    <i className="bi bi-key me-2" />
                    Update Password
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wishlist Section */}
      {wishlist.length > 0 && (
        <div className="mb-5" id="wishlist">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h2 className="section-title mb-0">
              <i className="bi bi-heart-fill text-danger me-3" />
              My Wishlist
            </h2>
          </div>

          <div className="wishlist-container" id="wishlistContainer">
            <div className="wishlist-scroll">
              {wishlist.map((item) => (
                <div
                  key={item._id}
                  className="wishlist-card"
                  onClick={() => navigate(`/listings/${item._id}`)}
                >
                  <div className="position-relative">
                    <img
                      src={
                        item.image?.url
                          ? item.image.url.replace(
                              "/upload/",
                              "/upload/w_300,q_auto,f_auto/"
                            )
                          : ""
                      }
                      alt={item.title}
                    />
                    <button
                      className="wishlist-remove-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeWishlistMutation.mutate(item._id);
                      }}
                      title="Remove from Wishlist"
                    >
                      <i className="bi bi-heart-fill" />
                    </button>
                  </div>
                  <div className="wishlist-card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h6 className="wishlist-title">{item.title}</h6>
                      {item.avgRating && item.avgRating > 0 ? (
                        <span className="text-warning small">
                          <i className="bi bi-star-fill me-1" />
                          {item.avgRating.toFixed(1)}
                        </span>
                      ) : null}
                    </div>
                    <p className="wishlist-location">
                      <i className="bi bi-geo-alt me-1" />
                      {item.location}
                    </p>
                    <div className="wishlist-price">
                      <strong>&#8377;{item.price?.toLocaleString("en-IN")}</strong>
                      <small>/night</small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="stats-container">
        <div className="row g-3">
          <div className="col-lg-3 col-md-6">
            <div className="stat-card">
              <div className="stat-icon active">
                <i className="bi bi-calendar-check" />
              </div>
              <div className="stat-number active">{stats.active}</div>
              <p className="stat-label">Active Bookings</p>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="stat-card">
              <div className="stat-icon completed">
                <i className="bi bi-check-circle" />
              </div>
              <div className="stat-number completed">{stats.completed}</div>
              <p className="stat-label">Completed Trips</p>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="stat-card">
              <div className="stat-icon pending">
                <i className="bi bi-clock" />
              </div>
              <div className="stat-number pending">{stats.pending}</div>
              <p className="stat-label">Payment Pending</p>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="stat-card">
              <div className="stat-icon cancelled">
                <i className="bi bi-x-circle" />
              </div>
              <div className="stat-number cancelled">{stats.cancelled}</div>
              <p className="stat-label">Cancelled</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Bookings */}
      {bookings.active.length > 0 && (
        <div className="mb-5">
          <h2 className="section-title">
            <i className="bi bi-calendar-check me-3 section-icon-active" />
            Your Active Bookings
          </h2>
          <div className="row g-4">
            {bookings.active.map((booking) => (
              <div key={booking._id} className="col-lg-4 col-md-6">
                <div className="booking-card position-relative">
                  {booking.listing?.image?.url && (
                    <img
                      src={booking.listing.image.url}
                      className="w-100"
                      alt={booking.listing.title}
                    />
                  )}
                  <span className="booking-status status-confirmed">
                    Confirmed
                  </span>

                  <div className="p-4">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 className="mb-0 fw-bold">{booking.listing?.title}</h5>
                      {booking.listing?.avgRating &&
                      booking.listing.avgRating > 0 ? (
                        <span className="text-warning small">
                          <i className="bi bi-star-fill me-1" />
                          {booking.listing.avgRating.toFixed(1)}
                        </span>
                      ) : null}
                    </div>
                    <p className="text-muted mb-3">
                      <i className="bi bi-geo-alt me-2" />
                      {booking.listing?.location}, {booking.listing?.country}
                    </p>

                    <div className="booking-details mb-3">
                      <div className="row">
                        <div className="col-6">
                          <small className="text-muted d-block">Check-in</small>
                          <strong>
                            {new Date(booking.checkIn).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                            })}
                          </strong>
                        </div>
                        <div className="col-6">
                          <small className="text-muted d-block">Check-out</small>
                          <strong>
                            {new Date(booking.checkOut).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                            })}
                          </strong>
                        </div>
                      </div>
                      <hr className="my-3" />
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <small className="text-muted d-block">Guests</small>
                          <strong>
                            {booking.guests}{" "}
                            {booking.guests === 1 ? "Guest" : "Guests"}
                          </strong>
                        </div>
                        <div className="text-end">
                          <div className="booking-price">
                            &#8377;{booking.totalPrice?.toLocaleString("en-IN")}
                          </div>
                          <small className="text-muted">Total Price</small>
                        </div>
                      </div>
                    </div>

                    <Link
                      to={`/listings/${booking.listing?._id}/bookings/${booking._id}`}
                      className="btn btn-primary-modern w-100 text-center text-decoration-none"
                    >
                      <i className="bi bi-eye me-2" />
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment Pending Bookings */}
      {bookings.pending.length > 0 && (
        <div className="mb-5">
          <h2 className="section-title">
            <i className="bi bi-clock me-3 section-icon-pending" />
            Payment Pending
          </h2>
          <div className="alert-modern">
            <i className="bi bi-info-circle me-2" />
            <strong>Action Required:</strong> Complete payment for these bookings
            within 30 minutes or they will expire automatically.
          </div>
          <div className="row g-4">
            {bookings.pending.map((booking) => {
              const now = new Date();
              const expiresAt = booking.expiresAt
                ? new Date(booking.expiresAt)
                : null;
              const isExpiringSoon =
                expiresAt && expiresAt.getTime() - now.getTime() < 5 * 60 * 1000;
              const isExpired = expiresAt && now > expiresAt;

              return (
                <div key={booking._id} className="col-lg-4 col-md-6">
                  <div className="booking-card position-relative">
                    {booking.listing?.image?.url && (
                      <img
                        src={booking.listing.image.url}
                        className="w-100"
                        alt={booking.listing.title}
                      />
                    )}
                    {isExpired ? (
                      <span className="booking-status status-expired">
                        Expired
                      </span>
                    ) : isExpiringSoon ? (
                      <span className="booking-status status-expiring">
                        Expiring Soon!
                      </span>
                    ) : (
                      <span className="booking-status status-pending">
                        Pending
                      </span>
                    )}

                    <div className="p-4">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="mb-0 fw-bold">{booking.listing?.title}</h5>
                        {booking.listing?.avgRating &&
                        booking.listing.avgRating > 0 ? (
                          <span className="text-warning small">
                            <i className="bi bi-star-fill me-1" />
                            {booking.listing.avgRating.toFixed(1)}
                          </span>
                        ) : null}
                      </div>
                      <p className="text-muted mb-3">
                        <i className="bi bi-geo-alt me-2" />
                        {booking.listing?.location}, {booking.listing?.country}
                      </p>

                      <div className="booking-details mb-3">
                        <div className="row">
                          <div className="col-6">
                            <small className="text-muted d-block">Check-in</small>
                            <strong>
                              {new Date(booking.checkIn).toLocaleDateString(
                                "en-IN",
                                { day: "numeric", month: "short" }
                              )}
                            </strong>
                          </div>
                          <div className="col-6">
                            <small className="text-muted d-block">Check-out</small>
                            <strong>
                              {new Date(booking.checkOut).toLocaleDateString(
                                "en-IN",
                                { day: "numeric", month: "short" }
                              )}
                            </strong>
                          </div>
                        </div>
                        <hr className="my-3" />
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <small className="text-muted d-block">Guests</small>
                            <strong>
                              {booking.guests}{" "}
                              {booking.guests === 1 ? "Guest" : "Guests"}
                            </strong>
                          </div>
                          <div className="text-end">
                            <div className="booking-price">
                              &#8377;{booking.totalPrice?.toLocaleString("en-IN")}
                            </div>
                            <small className="text-muted">Total Price</small>
                          </div>
                        </div>
                      </div>

                      {booking.expiresAt && !isExpired && (
                        <div className="alert alert-info py-2 mb-3">
                          <i className="bi bi-clock text-info me-2" />
                          <small>
                            Expires in:{" "}
                            <PendingCountdown expiresAt={booking.expiresAt} />
                          </small>
                        </div>
                      )}

                      {isExpired ? (
                        <button className="btn w-100 btn-secondary" disabled>
                          <i className="bi bi-x-circle me-2" />
                          Booking Expired
                        </button>
                      ) : (
                        <div className="d-flex flex-column gap-2">
                          <button
                            type="button"
                            className="btn btn-warning w-100"
                            onClick={() => resumeCheckoutMutation.mutate(booking._id)}
                            disabled={resumeCheckoutMutation.isPending}
                          >
                            <i className="bi bi-credit-card-fill me-2" />
                            {resumeCheckoutMutation.isPending
                              ? "Redirecting..."
                              : "Pay Now (Complete Payment)"}
                          </button>
                          <Link
                            to={`/listings/${booking.listing?._id}/bookings/${booking._id}`}
                            className="btn btn-outline-secondary btn-sm w-100 text-decoration-none"
                          >
                            <i className="bi bi-eye me-2" />
                            View Details
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Past Bookings (Travel Memories) */}
      {bookings.past.length > 0 && (
        <div className="mb-5">
          <h2 className="section-title">
            <i className="bi bi-check-circle me-3 section-icon-completed" />
            Your Travel Memories
          </h2>
          <div className="row g-4">
            {bookings.past.slice(0, visiblePastCount).map((booking) => (
              <div key={booking._id} className="col-lg-4 col-md-6">
                <div className="booking-card position-relative booking-card-completed">
                  {booking.listing?.image?.url && (
                    <img
                      src={booking.listing.image.url}
                      className="w-100"
                      alt={booking.listing.title}
                    />
                  )}
                  <span className="booking-status booking-status-completed">
                    Completed
                  </span>

                  <div className="p-4">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 className="mb-0 fw-bold">{booking.listing?.title}</h5>
                      {booking.listing?.avgRating &&
                      booking.listing.avgRating > 0 ? (
                        <span className="text-warning small">
                          <i className="bi bi-star-fill me-1" />
                          {booking.listing.avgRating.toFixed(1)}
                        </span>
                      ) : null}
                    </div>
                    <p className="text-muted mb-3">
                      <i className="bi bi-geo-alt me-2" />
                      {booking.listing?.location}, {booking.listing?.country}
                    </p>

                    <div className="booking-details mb-3">
                      <div className="row">
                        <div className="col-6">
                          <small className="text-muted d-block">Stayed</small>
                          <strong>
                            {new Date(booking.checkIn).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                            })}
                          </strong>
                        </div>
                        <div className="col-6">
                          <small className="text-muted d-block">To</small>
                          <strong>
                            {new Date(booking.checkOut).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                            })}
                          </strong>
                        </div>
                      </div>
                      <hr className="my-3" />
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <small className="text-muted d-block">Guests</small>
                          <strong>
                            {booking.guests}{" "}
                            {booking.guests === 1 ? "Guest" : "Guests"}
                          </strong>
                        </div>
                      </div>
                    </div>

                    <div className="d-flex gap-2">
                      <Link
                        to={`/listings/${booking.listing?._id}/bookings/${booking._id}`}
                        className="btn btn-outline-modern flex-fill text-center text-decoration-none"
                      >
                        <i className="bi bi-eye me-1" />
                        Details
                      </Link>
                      <Link
                        to={`/listings/${booking.listing?._id}`}
                        className="btn btn-primary-modern flex-fill text-center text-decoration-none"
                      >
                        <i className="bi bi-arrow-repeat me-1" />
                        Book Again
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {bookings.past.length > visiblePastCount && (
            <div className="text-center mt-4">
              <button
                className="btn btn-outline-modern"
                onClick={() => setVisiblePastCount((prev) => prev + 6)}
              >
                <i className="bi bi-chevron-down me-2" />
                Show More Memories
              </button>
            </div>
          )}
        </div>
      )}

      {/* Cancelled Bookings */}
      {bookings.cancelled.length > 0 && (
        <div className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="section-title mb-0">
              <i className="bi bi-x-circle me-3 section-icon-cancelled" />
              Cancelled Bookings ({bookings.cancelled.length})
            </h2>
            <button
              className="btn btn-outline-modern"
              type="button"
              onClick={() => setShowCancelled((prev) => !prev)}
            >
              <i
                className={`bi bi-chevron-${showCancelled ? "up" : "down"}`}
              />
            </button>
          </div>
          {showCancelled && (
            <div className="row g-4">
              {bookings.cancelled.map((booking) => (
                <div key={booking._id} className="col-lg-4 col-md-6">
                  <div className="booking-card position-relative booking-card-cancelled">
                    {booking.listing?.image?.url && (
                      <img
                        src={booking.listing.image.url}
                        className="w-100"
                        alt={booking.listing.title}
                      />
                    )}
                    <span className="booking-status status-cancelled">
                      Cancelled
                    </span>

                    <div className="p-4">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="mb-0 fw-bold text-muted">
                          {booking.listing?.title}
                        </h5>
                        {booking.listing?.avgRating &&
                        booking.listing.avgRating > 0 ? (
                          <span className="text-warning small">
                            <i className="bi bi-star-fill me-1" />
                            {booking.listing.avgRating.toFixed(1)}
                          </span>
                        ) : null}
                      </div>
                      <p className="text-muted mb-3">
                        <i className="bi bi-geo-alt me-2" />
                        {booking.listing?.location}, {booking.listing?.country}
                      </p>

                      <div className="booking-details mb-3">
                        <div className="row">
                          <div className="col-6">
                            <small className="text-muted d-block">Was for</small>
                            <strong className="text-muted">
                              {new Date(booking.checkIn).toLocaleDateString(
                                "en-IN",
                                { day: "numeric", month: "short" }
                              )}
                            </strong>
                          </div>
                          <div className="col-6">
                            <small className="text-muted d-block">To</small>
                            <strong className="text-muted">
                              {new Date(booking.checkOut).toLocaleDateString(
                                "en-IN",
                                { day: "numeric", month: "short" }
                              )}
                            </strong>
                          </div>
                        </div>
                        <hr className="my-3" />
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <small className="text-muted d-block">Guests</small>
                            <strong className="text-muted">
                              {booking.guests}{" "}
                              {booking.guests === 1 ? "Guest" : "Guests"}
                            </strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {stats.total === 0 && (
        <div className="empty-state">
          <i className="bi bi-airplane" />
          <h3>Your Travel Journey Awaits!</h3>
          <p>
            Ready to explore the world? Discover amazing destinations, cozy
            homestays, and unforgettable experiences.
          </p>
          <Link to="/listings" className="btn btn-color btn-md">
            Start Exploring
          </Link>
        </div>
      )}
    </div>
  );
}
