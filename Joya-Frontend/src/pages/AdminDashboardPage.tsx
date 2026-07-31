import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

import { useAuth } from "../hooks/useAuth";
import {
  getAdminDashboard,
  approveHostApplication,
  rejectHostApplication,
} from "../api/admin";
import "./AdminDashboardPage.css";

type FilterStatus = "all" | "pending" | "approved" | "rejected";

export default function AdminDashboardPage() {
  const queryClient = useQueryClient();
  const { data: authData, isLoading: authLoading } = useAuth();
  const currentUser = authData?.currentUser;

  const [activeFilter, setActiveFilter] = useState<FilterStatus>("all");

  const dashboardQuery = useQuery({
    queryKey: ["adminDashboard"],
    queryFn: getAdminDashboard,
    enabled: Boolean(currentUser && currentUser.role === "admin"),
  });

  const approveMutation = useMutation({
    mutationFn: (userId: string) => approveHostApplication(userId),
    onSuccess: (data) => {
      toast.success(data.message || "Application approved successfully!");
      queryClient.invalidateQueries({ queryKey: ["adminDashboard"] });
    },
    onError: (err) => {
      toast.error(
        err instanceof AxiosError && err.response?.data?.message
          ? err.response.data.message
          : "Failed to approve application."
      );
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (userId: string) => rejectHostApplication(userId),
    onSuccess: (data) => {
      toast.success(data.message || "Application rejected.");
      queryClient.invalidateQueries({ queryKey: ["adminDashboard"] });
    },
    onError: (err) => {
      toast.error(
        err instanceof AxiosError && err.response?.data?.message
          ? err.response.data.message
          : "Failed to reject application."
      );
    },
  });

  if (currentUser && currentUser.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  if (authLoading || dashboardQuery.isLoading) {
    return (
      <div className="container mt-5 text-center py-5">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading admin dashboard...</span>
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
            : "Failed to load admin dashboard."}
        </div>
        <Link to="/listings" className="btn btn-color mt-3">
          Explore Listings
        </Link>
      </div>
    );
  }

  const { applications = [] } = dashboardQuery.data;

  const counts = {
    all: applications.length,
    pending: applications.filter((app) => app.host?.status === "pending").length,
    approved: applications.filter((app) => app.host?.status === "approved").length,
    rejected: applications.filter((app) => app.host?.status === "rejected").length,
  };

  const filteredApplications = applications.filter((app) => {
    if (activeFilter === "all") return true;
    return app.host?.status === activeFilter;
  });

  const getEmptyStateContent = () => {
    switch (activeFilter) {
      case "pending":
        return {
          title: "No Pending Applications",
          message: "All host applications have been reviewed.",
        };
      case "approved":
        return {
          title: "No Approved Hosts",
          message: "No host applications have been approved yet.",
        };
      case "rejected":
        return {
          title: "No Rejected Applications",
          message: "No host applications have been rejected.",
        };
      default:
        return {
          title: "No Applications Found",
          message: "No host applications match the current filter.",
        };
    }
  };

  const emptyContent = getEmptyStateContent();

  const totalBadgeText = `${filteredApplications.length} ${
    activeFilter === "all"
      ? "Applications"
      : activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)
  }`;

  return (
    <div className="container mt-4 admin-dashboard">
      {/* Admin Dashboard Header */}
      <div className="dashboard-header mb-4">
        <div className="row align-items-center">
          <div className="col-md-8">
            <div className="d-flex align-items-center">
              <div className="host-avatar-container me-3">
                <img
                  src="https://res.cloudinary.com/dcvaeebuf/image/upload/v1759743353/host1.jpg"
                  alt="Admin"
                  className="host-avatar"
                />
              </div>
              <div>
                <h1 className="mb-2">
                  <i className="bi bi-shield-shaded me-2" />
                  Admin Dashboard - Welcome, {currentUser?.username || "Admin"}!
                </h1>
                <p className="mb-0 opacity-75">
                  Manage host applications, oversee the platform, and ensure quality
                  standards.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4 text-md-end mt-3 mt-md-0">
            <div className="d-flex gap-2 justify-content-md-end">
              <span className="badge badge-total-count fs-6" id="totalCount">
                {totalBadgeText}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          {/* Filter Tabs */}
          <ul className="nav nav-tabs mb-4" id="statusTabs" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeFilter === "all" ? "active" : ""}`}
                onClick={() => setActiveFilter("all")}
                type="button"
              >
                All Applications
                <span className="badge bg-secondary ms-1">{counts.all}</span>
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeFilter === "pending" ? "active" : ""}`}
                onClick={() => setActiveFilter("pending")}
                type="button"
              >
                Pending
                <span className="badge badge-status-pending text-dark ms-1">
                  {counts.pending}
                </span>
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeFilter === "approved" ? "active" : ""}`}
                onClick={() => setActiveFilter("approved")}
                type="button"
              >
                Approved
                <span className="badge badge-status-approved ms-1">
                  {counts.approved}
                </span>
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeFilter === "rejected" ? "active" : ""}`}
                onClick={() => setActiveFilter("rejected")}
                type="button"
              >
                Rejected
                <span className="badge badge-status-rejected ms-1">
                  {counts.rejected}
                </span>
              </button>
            </li>
          </ul>

          {/* Applications Table or Contextual Empty State */}
          {filteredApplications.length > 0 ? (
            <div id="applicationsTable">
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead className="table-dark">
                    <tr>
                      <th>Photo</th>
                      <th>Username</th>
                      <th>Full Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Dates</th>
                      <th>Status</th>
                      <th>Actions/Info</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApplications.map((app) => (
                      <tr key={app._id} className="application-row">
                        <td>
                          {app.host?.avatar?.url ? (
                            <img
                              src={app.host.avatar.url}
                              alt={app.username}
                              className="rounded-circle"
                              style={{ width: "40px", height: "40px", objectFit: "cover" }}
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                                const next = e.currentTarget.nextElementSibling as HTMLElement | null;
                                if (next) next.style.display = "flex";
                              }}
                            />
                          ) : null}
                          <div
                            style={{
                              display: app.host?.avatar?.url ? "none" : "flex",
                              width: "40px",
                              height: "40px",
                              borderRadius: "50%",
                              background: "#e9ecef",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "1.5rem",
                              color: "#6c757d",
                            }}
                          >
                            <i className="bi bi-person-fill" />
                          </div>
                        </td>
                        <td className="fw-bold">{app.username}</td>
                        <td>{app.host?.fullName || "N/A"}</td>
                        <td>{app.email}</td>
                        <td>{app.host?.phone || "N/A"}</td>
                        <td>
                          <div className="d-flex flex-column">
                            {app.host?.appliedAt ? (
                              <small className="text-muted">
                                <i className="bi bi-calendar-plus me-1" />
                                Applied:{" "}
                                {new Date(app.host.appliedAt).toLocaleDateString("en-IN")}
                              </small>
                            ) : null}
                            {app.host?.status === "approved" && app.host?.approvedAt ? (
                              <small className="text-success">
                                <i className="bi bi-calendar-check me-1" />
                                Approved:{" "}
                                {new Date(app.host.approvedAt).toLocaleDateString("en-IN")}
                              </small>
                            ) : null}
                            {!app.host?.appliedAt && (
                              <small className="text-muted">
                                <i className="bi bi-calendar-x me-1" />
                                No date available
                              </small>
                            )}
                          </div>
                        </td>
                        <td>
                          {app.host?.status === "pending" && (
                            <span className="badge badge-status-pending">
                              <i className="bi bi-clock me-1" />
                              Pending
                            </span>
                          )}
                          {app.host?.status === "approved" && (
                            <span className="badge badge-status-approved">
                              <i className="bi bi-check-circle me-1" />
                              Approved
                            </span>
                          )}
                          {app.host?.status === "rejected" && (
                            <span className="badge badge-status-rejected">
                              <i className="bi bi-x-circle me-1" />
                              Rejected
                            </span>
                          )}
                        </td>
                        <td>
                          {app.host?.status === "pending" ? (
                            <div className="btn-group btn-group-sm">
                              <button
                                type="button"
                                className="btn btn-outline-success btn-sm"
                                title="Approve Application"
                                disabled={approveMutation.isPending}
                                onClick={() => approveMutation.mutate(app._id)}
                              >
                                <i className="bi bi-check" /> Approve
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline-danger btn-sm"
                                title="Reject Application"
                                disabled={rejectMutation.isPending}
                                onClick={() => {
                                  if (
                                    window.confirm(
                                      `Are you sure you want to reject ${app.username}'s application?`
                                    )
                                  ) {
                                    rejectMutation.mutate(app._id);
                                  }
                                }}
                              >
                                <i className="bi bi-x" /> Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-muted small">
                              <i className="bi bi-check-circle me-1" />
                              Completed
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-5">
              <i className="bi bi-inbox text-muted display-4 d-block mb-3" />
              <h4 className="text-muted fw-bold">{emptyContent.title}</h4>
              <p className="text-muted">{emptyContent.message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
