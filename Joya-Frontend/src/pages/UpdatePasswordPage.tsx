import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

import { updatePassword } from "../api/auth";
import type { UpdatePasswordPayload } from "../types/user";

type ApiErrorResponse = {
  success: false;
  message: string;
  errors?: Record<string, string>;
};

export default function UpdatePasswordPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<UpdatePasswordPayload>({
    currentPassword: "",
    password: "",
    confirm: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [validated, setValidated] = useState(false);

  const passwordsFilled =
    formData.password.length > 0 && formData.confirm.length > 0;
  const passwordsMatch =
    passwordsFilled && formData.password === formData.confirm;
  const passwordsMismatch =
    passwordsFilled && formData.password !== formData.confirm;
  const isSamePassword =
    formData.currentPassword.length > 0 &&
    formData.password.length > 0 &&
    formData.currentPassword === formData.password;

  const updateMutation = useMutation({
    mutationFn: updatePassword,
    onSuccess: (data) => {
      toast.success(data.message || "Password updated successfully!");
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

    if (updateMutation.isError) {
      updateMutation.reset();
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (!form.checkValidity() || passwordsMismatch || isSamePassword) {
      setValidated(true);
      return;
    }

    setValidated(true);
    updateMutation.mutate(formData);
  };

  const apiError =
    updateMutation.error instanceof AxiosError
      ? (updateMutation.error.response?.data as ApiErrorResponse)
      : null;

  return (
    <div className="container row mt-3">
      <div className="col-md-6 offset-md-3">
        <h3>Change Password</h3>

        <form
          noValidate
          className={`needs-validation ${validated ? "was-validated" : ""}`}
          onSubmit={handleSubmit}
        >
          {/* Current Password */}
          <div className="mb-3 position-relative">
            <label htmlFor="currentPassword" className="form-label">
              Current Password
            </label>
            <input
              name="currentPassword"
              id="currentPassword"
              type={showPassword ? "text" : "password"}
              className={`form-control password-input ${
                apiError?.errors?.currentPassword ? "is-invalid" : ""
              }`}
              required
              value={formData.currentPassword}
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
              {apiError?.errors?.currentPassword || "Please enter current password."}
            </div>
          </div>

          {/* New Password */}
          <div className="mb-3 position-relative">
            <label htmlFor="password" className="form-label">
              New Password
            </label>
            <input
              name="password"
              id="password"
              type={showPassword ? "text" : "password"}
              className={`form-control password-input ${
                apiError?.errors?.password || isSamePassword ? "is-invalid" : ""
              }`}
              required
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
              {apiError?.errors?.password ||
                (isSamePassword
                  ? "New password must be different from your current password."
                  : "Please enter new password.")}
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-3">
            <label htmlFor="confirm" className="form-label">
              Confirm Password
            </label>
            <input
              name="confirm"
              id="confirm"
              type={showPassword ? "text" : "password"}
              className={`form-control ${
                passwordsMatch
                  ? "is-valid"
                  : passwordsMismatch
                    ? "is-invalid"
                    : ""
              }`}
              required
              value={formData.confirm}
              onChange={handleChange}
            />
            <div className="valid-feedback">Passwords match!</div>
            <div className="invalid-feedback">
              {passwordsMismatch
                ? "Passwords do not match."
                : "Please confirm your password."}
            </div>
          </div>

          <div className="d-flex flex-row-reverse justify-content-between align-items-center mb-3">
            <Link to="/forgot" className="text-decoration-none small text-muted">
              Forgot Password?
            </Link>
          </div>

          {/* General API error */}
          {apiError?.message && !apiError.errors && (
            <div className="text-danger small mb-3">{apiError.message}</div>
          )}

          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2">
            <button
              id="submitBtn"
              type="submit"
              className="btn btn-color"
              disabled={
                passwordsMismatch || isSamePassword || updateMutation.isPending
              }
            >
              {updateMutation.isPending ? "Updating..." : "Update Password"}
            </button>

            <Link to="/listings" className="text-muted text-decoration-none small">
              <i className="bi bi-caret-left-fill me-1" />
              Go Back
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
