import { useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

import { changeEmail } from "../api/auth";
import type { CurrentUser, ChangeEmailPayload, AuthResponse } from "../types/user";

type ApiErrorResponse = {
  success: false;
  message: string;
  errors?: Record<string, string>;
};

export default function ChangeEmailPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const outletContext = useOutletContext<{ currentUser?: CurrentUser | null }>();
  const currentUser = outletContext?.currentUser;

  const [formData, setFormData] = useState<ChangeEmailPayload>({
    newEmail: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [validated, setValidated] = useState(false);

  const changeEmailMutation = useMutation({
    mutationFn: changeEmail,
    onSuccess: (data) => {
      if (data.user) {
        queryClient.setQueryData<AuthResponse>(["auth"], (old) =>
          old
            ? {
                ...old,
                currentUser: { ...old.currentUser!, email: data.user.email },
              }
            : { currentUser: data.user, userWishlist: [] },
        );
        queryClient.invalidateQueries({ queryKey: ["auth"] });
      }
      toast.success(data.message || "Email updated successfully!");
      navigate("/listings");
    },
    onError: (error) => {
      if (error instanceof AxiosError && !error.response) {
        toast.error("Network error. Please check your connection and try again.");
      }
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (changeEmailMutation.isError) {
      changeEmailMutation.reset();
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (!form.checkValidity()) {
      setValidated(true);
      return;
    }

    setValidated(true);
    changeEmailMutation.mutate(formData);
  };

  const apiError =
    changeEmailMutation.error instanceof AxiosError
      ? (changeEmailMutation.error.response?.data as ApiErrorResponse)
      : null;

  return (
    <div className="container row mt-3">
      <div className="col-md-6 offset-md-3">
        <h3>Change Email Address</h3>

        <form
          noValidate
          className={`needs-validation ${validated ? "was-validated" : ""}`}
          onSubmit={handleSubmit}
        >
          {/* Current Email Display */}
          <div className="mb-3">
            <label className="form-label">Current Email</label>
            <div className="form-control bg-light text-muted">
              {currentUser?.email || "Not available"}
            </div>
          </div>

          {/* New Email */}
          <div className="mb-3">
            <label htmlFor="newEmail" className="form-label">
              New Email Address
            </label>
            <input
              name="newEmail"
              id="newEmail"
              type="email"
              className={`form-control ${
                apiError?.errors?.newEmail ? "is-invalid" : ""
              }`}
              required
              placeholder="Enter your new email address"
              value={formData.newEmail}
              onChange={handleChange}
            />
            <div className="invalid-feedback">
              {apiError?.errors?.newEmail || "Enter a valid email address."}
            </div>
            <div className="form-text">
              Make sure you have access to this email address.
            </div>
          </div>

          {/* Password Confirmation */}
          <div className="mb-3 position-relative">
            <label htmlFor="password" className="form-label">
              Confirm Password
            </label>
            <input
              name="password"
              id="password"
              type={showPassword ? "text" : "password"}
              className={`form-control password-input ${
                apiError?.errors?.password ? "is-invalid" : ""
              }`}
              required
              placeholder="Enter your current password"
              value={formData.password}
              onChange={handleChange}
            />
            <i
              className={`bi ${
                showPassword ? "bi-eye" : "bi-eye-slash"
              } eye-toggle`}
              onClick={() => setShowPassword((prev) => !prev)}
              role="button"
            />
            <div className="invalid-feedback">
              {apiError?.errors?.password || "Password is required."}
            </div>
            <div className="form-text">
              Enter your current password to confirm this change.
            </div>
          </div>

          {/* Warning Notice */}
          <div className="alert alert-warning small">
            <strong>⚠️ Important:</strong> Make sure you have access to the new email address.
          </div>

          {/* Non-field API Error */}
          {apiError?.message && !apiError.errors && (
            <div className="text-danger small mb-3">{apiError.message}</div>
          )}

          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2">
            <button
              type="submit"
              className="btn btn-color"
              disabled={changeEmailMutation.isPending}
            >
              {changeEmailMutation.isPending ? "Updating..." : "Change Email"}
            </button>
            <Link to="/listings" className="text-muted text-decoration-none small">
              <i className="bi bi-caret-left-fill me-1" />
              Back to Dashboard
            </Link>
          </div>

          <div className="text-center mt-3">
            <small className="text-muted">
              Need help? Visit our{" "}
              <Link to="/info/help-center" target="_blank" className="text-primary">
                Help Center
              </Link>{" "}
              or{" "}
              <Link to="/info/contact" target="_blank" className="text-primary">
                Contact Support
              </Link>
            </small>
          </div>

          <br />
          <br />
        </form>
      </div>
    </div>
  );
}
