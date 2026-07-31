import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { useAuth } from "../hooks/useAuth";
import { getHostDashboard } from "../api/host";
import "./HostDashboardPage.css";

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

export default function HostDashboardPage() {
  const { data: authData, isLoading: authLoading } = useAuth();
  const currentUser = authData?.currentUser;

  const [showAllProperties, setShowAllProperties] = useState<boolean>(false);

  const dashboardQuery = useQuery({
    queryKey: ["hostDashboard"],
    queryFn: getHostDashboard,
    enabled: Boolean(currentUser),
  });

  if (authLoading || dashboardQuery.isLoading) {
    return (
      <div className="container mt-5 text-center py-5">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading host dashboard...</span>
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
            : "Failed to load host dashboard."}
        </div>
        <Link to="/listings" className="btn btn-color mt-3">
          Explore Listings
        </Link>
      </div>
    );
  }

  const { listings, bookings, stats } = dashboardQuery.data;
  const avatarUrl = currentUser?.host?.avatar?.url;

  const displayedListings = showAllProperties ? listings : listings.slice(0, 3);

  return (
    <div className="container-fluid px-4 py-3">
      {/* Host Dashboard Header */}
      <div className="dashboard-header">
        <div className="row align-items-center">
          <div className="col-md-8">
            <div className="d-flex align-items-center">
              <div className="host-avatar-container me-3">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={currentUser?.username}
                    className="host-avatar"
                  />
                ) : (
                  <div className="host-avatar-placeholder d-flex align-items-center justify-content-center">
                    <i className="bi bi-person-fill" />
                  </div>
                )}
              </div>
              <div>
                <h1 className="mb-2">
                  Host Dashboard - Welcome, {currentUser?.username || "Host"}! 🏠
                </h1>
                <p className="mb-0 opacity-75">
                  Manage your properties, track earnings, and provide amazing
                  experiences for your guests.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4 text-md-end mt-3 mt-md-0">
            <Link to="/listings/new" className="btn find-stays-btn">
              <i className="bi bi-plus-circle me-2" />
              Add New Listing
            </Link>
          </div>
        </div>
      </div>

      {/* Host Stats Cards */}
      <div className="stats-container">
        <div className="row g-3">
          <div className="col-lg-3 col-md-6">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: "#6366f1", color: "white" }}>
                <i className="bi bi-house-door" />
              </div>
              <div className="stat-number" style={{ color: "#6366f1" }}>
                {stats.totalListings}
              </div>
              <p className="stat-label">Total Properties</p>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="stat-card">
              <div className="stat-icon active">
                <i className="bi bi-calendar-check" />
              </div>
              <div className="stat-number active">{stats.activeBookings}</div>
              <p className="stat-label">Active Bookings</p>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="stat-card">
              <div className="stat-icon pending">
                <i className="bi bi-clock-history" />
              </div>
              <div className="stat-number pending">{stats.pendingBookings}</div>
              <p className="stat-label">Pending Requests</p>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: "#10b981", color: "white" }}>
                <i className="bi bi-currency-rupee" />
              </div>
              <div className="stat-number" style={{ color: "#10b981" }}>
                &#8377;{stats.monthlyEarnings.toLocaleString("en-IN")}
              </div>
              <p className="stat-label">This Month</p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics & Activity Feed */}
      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <div className="stat-card h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="section-title mb-0">
                <i className="bi bi-activity me-2" />
                All Booking Activity
              </h3>
              <span className="badge bg-light text-dark">
                {bookings.recent.length} Total
              </span>
            </div>

            {bookings.recent.length > 0 ? (
              <div className="activity-list" style={{ maxHeight: "400px", overflowY: "auto", paddingRight: "0.25rem" }}>
                {bookings.recent.map((booking, index) => (
                  <div
                    key={booking._id}
                    className={`activity-item ${
                      index < bookings.recent.length - 1 ? "border-bottom" : ""
                    } pb-3 mb-3`}
                  >
                    <div className="row align-items-center">
                      <div className="col-md-6">
                        <div className="d-flex align-items-center">
                          <div className="activity-icon me-3">
                            {booking.status === "confirmed" ? (
                              <i className="bi bi-check-circle text-success" />
                            ) : booking.status === "pending_payment" ? (
                              <i className="bi bi-clock text-warning" />
                            ) : (
                              <i className="bi bi-x-circle text-danger" />
                            )}
                          </div>
                          <div>
                            <strong>{booking.listing?.title || "Property"}</strong>
                            <div className="text-muted small">
                              by {booking.user?.username || "Unknown Guest"}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3 text-center">
                        <div className="small text-muted mb-1">Dates</div>
                        <div className="d-flex justify-content-center align-items-center gap-2">
                          <div className="text-center">
                            <div className="small text-muted">In</div>
                            <div className="small fw-bold">
                              {new Date(booking.checkIn).toLocaleDateString(
                                "en-IN",
                                { month: "short", day: "numeric" }
                              )}
                            </div>
                          </div>
                          <div className="text-muted">-</div>
                          <div className="text-center">
                            <div className="small text-muted">Out</div>
                            <div className="small fw-bold">
                              {new Date(booking.checkOut).toLocaleDateString(
                                "en-IN",
                                { month: "short", day: "numeric" }
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3 text-end">
                        <div className="fw-bold text-success">
                          &#8377;{booking.totalPrice?.toLocaleString("en-IN")}
                        </div>
                        <div className="small text-muted text-capitalize">
                          {booking.status.replace("_", " ")}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <i className="bi bi-calendar-x display-4 text-muted mb-3 d-block" />
                <h5 className="text-muted">No Recent Activity</h5>
                <p className="text-muted">
                  Your booking activity will appear here once guests start booking
                  your properties.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="col-lg-4">
          <div className="stat-card h-100">
            <h3 className="section-title mb-3">
              <i className="bi bi-speedometer2 me-2" />
              Performance Overview
            </h3>

            <div className="performance-item mb-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="text-muted small">Total Earnings</div>
                  <div className="h4 mb-0 text-success">
                    &#8377;{stats.totalEarnings.toLocaleString("en-IN")}
                  </div>
                </div>
                <i className="bi bi-graph-up-arrow text-success fs-4" />
              </div>
            </div>

            <div className="performance-item mb-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="text-muted small">Completed Bookings</div>
                  <div className="h4 mb-0">{stats.completedBookings}</div>
                </div>
                <i className="bi bi-check-circle text-primary fs-4" />
              </div>
            </div>

            <div className="performance-item mb-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="text-muted small">Occupancy Rate</div>
                  <div className="h4 mb-0">{stats.occupancyRate}%</div>
                </div>
                <i className="bi bi-pie-chart text-info fs-4" />
              </div>
            </div>

            <div className="quick-actions">
              <h6 className="mb-2">Quick Actions</h6>
              <div className="d-grid gap-2">
                <Link to="/listings/new" className="btn btn-outline-primary btn-sm">
                  <i className="bi bi-plus-circle me-1" />
                  Add Property
                </Link>
                <Link to="/listings" className="btn btn-outline-secondary btn-sm">
                  <i className="bi bi-eye me-1" />
                  View All Listings
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* My Properties Section */}
      {listings.length > 0 ? (
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="section-title mb-0">
              <i className="bi bi-house-heart me-2" />
              My Properties ({listings.length})
            </h2>
            {listings.length > 3 && (
              <div className="d-flex align-items-center gap-2">
                <span className="text-muted small">
                  {showAllProperties ? "Show Less" : "View All"}
                </span>
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => setShowAllProperties((prev) => !prev)}
                >
                  <i
                    className={`bi bi-chevron-${showAllProperties ? "up" : "down"}`}
                  />
                </button>
              </div>
            )}
          </div>

          <div className="row g-4 mb-3">
            {displayedListings.map((listing) => (
              <div key={listing._id} className="col-lg-4 col-md-6">
                <div className="property-card">
                  {listing.image?.url && (
                    <img
                      src={listing.image.url}
                      className="property-image"
                      alt={listing.title}
                    />
                  )}

                  <div className="property-content">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 className="property-title mb-0">{listing.title}</h5>
                      {listing.avgRating && listing.avgRating > 0 ? (
                        <span className="text-warning small">
                          <i className="bi bi-star-fill me-1" />
                          {listing.avgRating.toFixed(1)}
                        </span>
                      ) : (
                        <span className="text-muted small">No reviews</span>
                      )}
                    </div>
                    <p className="property-location">
                      <i className="bi bi-geo-alt me-1" />
                      {listing.location}, {listing.country}
                    </p>

                    <div className="property-stats">
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="property-price">
                          &#8377;{listing.price?.toLocaleString("en-IN")}/night
                        </span>
                        <div className="property-actions d-flex gap-2">
                          <Link
                            to={`/listings/${listing._id}`}
                            className="btn btn-sm btn-outline-primary"
                          >
                            <i className="bi bi-eye" />
                          </Link>
                          <Link
                            to={`/listings/${listing._id}/edit`}
                            className="btn btn-sm btn-outline-secondary"
                          >
                            <i className="bi bi-pencil" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-5">
          <i className="bi bi-house-add display-1 text-muted mb-4 d-block" />
          <h3 className="text-muted mb-3">Start Your Hosting Journey!</h3>
          <p className="text-muted mb-4">
            You haven't added any properties yet. Add your first listing to start
            earning.
          </p>
          <Link to="/listings/new" className="btn btn-primary btn-lg">
            <i className="bi bi-plus-circle me-2" />
            Add Your First Property
          </Link>
        </div>
      )}

      {/* Booking Management Sections */}
      <div className="row g-4 mb-4">
        {/* Confirmed Bookings */}
        <div className="col-lg-6">
          <div className="stat-card h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="section-title mb-0">
                <i className="bi bi-check-circle text-success me-2" />
                Confirmed Bookings
              </h3>
              <span className="badge bg-success">{bookings.active.length}</span>
            </div>

            {bookings.active.length > 0 ? (
              <div className="booking-list" style={{ maxHeight: "400px", overflowY: "auto" }}>
                {bookings.active.map((booking) => (
                  <div key={booking._id} className="booking-item border-bottom pb-3 mb-3">
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="flex-grow-1">
                        <h6 className="mb-1">{booking.listing?.title}</h6>
                        <p className="text-muted small mb-1">
                          <i className="bi bi-person me-1" />
                          {booking.user?.username || "Unknown Guest"}
                        </p>
                        <p className="text-muted small mb-1">
                          <i className="bi bi-calendar3 me-1" />
                          {new Date(booking.checkIn).toLocaleDateString("en-IN", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}{" "}
                          -{" "}
                          {new Date(booking.checkOut).toLocaleDateString("en-IN", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                        <p className="text-muted small mb-0">
                          <i className="bi bi-people me-1" />
                          {booking.guests} guests •{" "}
                          <span className="text-success fw-bold">
                            &#8377;{booking.totalPrice?.toLocaleString("en-IN")}
                          </span>
                        </p>
                      </div>
                      <div className="text-end">
                        <span className="badge bg-success">Confirmed</span>
                        <div className="mt-1">
                          <small className="text-muted">
                            ID: #{booking._id.slice(-10)}
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <i className="bi bi-calendar-check display-4 text-muted mb-3 d-block" />
                <h6 className="text-muted">No Confirmed Bookings</h6>
                <p className="text-muted small">
                  Upcoming confirmed bookings will appear here.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Pending Requests */}
        <div className="col-lg-6">
          <div className="stat-card h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="section-title mb-0">
                <i className="bi bi-clock-history text-warning me-2" />
                Pending Requests
              </h3>
              <span className="badge bg-warning text-dark">
                {bookings.pending.length}
              </span>
            </div>

            {bookings.pending.length > 0 ? (
              <div className="booking-list" style={{ maxHeight: "400px", overflowY: "auto" }}>
                {bookings.pending.map((booking) => {
                  const now = new Date();
                  const expiresAt = booking.expiresAt
                    ? new Date(booking.expiresAt)
                    : null;
                  const isExpiringSoon =
                    expiresAt &&
                    expiresAt.getTime() - now.getTime() < 5 * 60 * 1000;

                  return (
                    <div key={booking._id} className="booking-item border-bottom pb-3 mb-3">
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <h6 className="mb-1">{booking.listing?.title}</h6>
                          <p className="text-muted small mb-1">
                            <i className="bi bi-person me-1" />
                            {booking.user?.username || "Unknown Guest"}
                          </p>
                          <p className="text-muted small mb-1">
                            <i className="bi bi-calendar3 me-1" />
                            {new Date(booking.checkIn).toLocaleDateString("en-IN", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}{" "}
                            -{" "}
                            {new Date(booking.checkOut).toLocaleDateString("en-IN", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                          <p className="text-muted small mb-2">
                            <i className="bi bi-people me-1" />
                            {booking.guests} guests •{" "}
                            <span className="text-success fw-bold">
                              &#8377;{booking.totalPrice?.toLocaleString("en-IN")}
                            </span>
                          </p>
                          {booking.expiresAt && (
                            <p className="text-muted small mb-0">
                              <i className="bi bi-clock me-1" />
                              <PendingCountdown expiresAt={booking.expiresAt} />
                            </p>
                          )}
                        </div>
                        <div className="text-end">
                          <span
                            className={`badge ${
                              isExpiringSoon ? "bg-danger text-white" : "bg-warning text-dark"
                            }`}
                          >
                            {isExpiringSoon ? "Expiring Soon!" : "Pending"}
                          </span>
                          <div className="mt-1">
                            <small className="text-muted">
                              ID: #{booking._id.slice(-10)}
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-4">
                <i className="bi bi-clock display-4 text-muted mb-3 d-block" />
                <h6 className="text-muted">No Pending Requests</h6>
                <p className="text-muted small">
                  New booking requests will appear here for your review.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
