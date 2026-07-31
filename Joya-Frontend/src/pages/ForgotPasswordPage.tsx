import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

import { sendForgotOTP, forgotPassword } from "../api/auth";
import type { ForgotPasswordPayload } from "../types/user";

type ApiErrorResponse = {
  success: false;
  message: string;
  errors?: Record<string, string>;
};

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<ForgotPasswordPayload>({
    username: "",
    email: "",
    code: "",
    password: "",
    confirm: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [validated, setValidated] = useState(false);
  const [cooldown, setCooldown] = useState<number>(0);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  const passwordsFilled =
    formData.password.length > 0 && formData.confirm.length > 0;
  const passwordsMatch =
    passwordsFilled && formData.password === formData.confirm;
  const passwordsMismatch =
    passwordsFilled && formData.password !== formData.confirm;

  // Mutation for sending OTP
  const sendOtpMutation = useMutation({
    mutationFn: sendForgotOTP,
    onSuccess: (data) => {
      setCooldown(data.remainingCooldown || 60);
      toast.success(data.message || "OTP code sent to your email!");
    },
    onError: (error) => {
      if (error instanceof AxiosError && !error.response) {
        toast.error("Network error. Please check your connection and try again.");
      }
    },
  });

  // Mutation for resetting password
  const resetPasswordMutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: (data) => {
      toast.success(data.message || "Password has been reset successfully! Please log in.");
      navigate("/login");
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

    if (resetPasswordMutation.isError) {
      resetPasswordMutation.reset();
    }
  };

  const handleGetOtp = () => {
    if (!formData.username || !formData.email) {
      alert("Please enter your username and email first.");
      return;
    }
    sendOtpMutation.mutate({
      username: formData.username,
      email: formData.email,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (!form.checkValidity() || passwordsMismatch) {
      setValidated(true);
      return;
    }

    setValidated(true);
    resetPasswordMutation.mutate(formData);
  };

  const otpApiError =
    sendOtpMutation.error instanceof AxiosError
      ? (sendOtpMutation.error.response?.data as ApiErrorResponse)?.message
      : null;

  const resetApiError =
    resetPasswordMutation.error instanceof AxiosError
      ? (resetPasswordMutation.error.response?.data as ApiErrorResponse)
      : null;

  return (
    <div className="container row mt-3">
      <div className="col-md-6 offset-md-3">
        <h3>Forgot Password</h3>

        {otpApiError && (
          <div className="alert alert-danger py-2 small" role="alert">
            {otpApiError}
          </div>
        )}

        <form
          noValidate
          className={`needs-validation ${validated ? "was-validated" : ""}`}
          onSubmit={handleSubmit}
        >
          {/* Username */}
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              name="username"
              id="username"
              type="text"
              className="form-control"
              required
              value={formData.username}
              onChange={handleChange}
            />
            <div className="valid-feedback">Looks Good!</div>
            <div className="invalid-feedback">Please enter your username.</div>
          </div>

          {/* Email */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              name="email"
              id="email"
              type="email"
              className="form-control"
              required
              value={formData.email}
              onChange={handleChange}
            />
            <div className="valid-feedback">Looks Good!</div>
            <div className="invalid-feedback">Please enter a valid email.</div>
          </div>

          {/* Get OTP Button */}
          <div className="d-flex align-items-center mb-3">
            <button
              type="button"
              className="btn btn-dark me-3"
              id="getCodeBtn"
              onClick={handleGetOtp}
              disabled={
                !formData.username ||
                !formData.email ||
                cooldown > 0 ||
                sendOtpMutation.isPending
              }
            >
              {sendOtpMutation.isPending
                ? "Sending..."
                : cooldown > 0
                  ? `Wait ${cooldown}s`
                  : "Get OTP"}
            </button>
            {cooldown > 0 && (
              <small className="text-muted">
                You can request OTP again in {cooldown}s
              </small>
            )}
          </div>

          {/* Enter OTP */}
          <div className="mb-3">
            <label htmlFor="code" className="form-label">
              Enter OTP
            </label>
            <input
              name="code"
              id="code"
              type="text"
              className="form-control"
              required
              value={formData.code}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 6);
                setFormData((prev) => ({ ...prev, code: val }));
              }}
            />
            <div className="invalid-feedback">Please enter the OTP code.</div>
          </div>

          {/* New Password */}
          <div className="mb-3 position-relative">
            <label htmlFor="password" className="form-label">
              Enter a New Password
            </label>
            <input
              name="password"
              id="password"
              type={showPassword ? "text" : "password"}
              className="form-control password-input"
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
            <div className="valid-feedback">Looks Good!</div>
            <div className="invalid-feedback">Please enter a new password.</div>
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

          {/* Non-field API error */}
          {resetApiError?.message && (
            <div className="text-danger small mb-3">{resetApiError.message}</div>
          )}

          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2">
            <button
              id="submitBtn"
              type="submit"
              className="btn btn-color"
              disabled={passwordsMismatch || resetPasswordMutation.isPending}
            >
              {resetPasswordMutation.isPending ? "Resetting..." : "Reset Password"}
            </button>

            <Link to="/login" className="text-muted text-decoration-none small">
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
