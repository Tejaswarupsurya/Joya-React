import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

import {
  getPendingVerification,
  verifyEmail,
  resendOTP,
} from "../api/auth";
import type { AuthResponse } from "../types/user";

type ApiErrorResponse = {
  success: false;
  message: string;
};

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [otp, setOtp] = useState("");
  const [validated, setValidated] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [cooldown, setCooldown] = useState<number>(0);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Fetch pending verification status from session
  const pendingQuery = useQuery({
    queryKey: ["pending-verification"],
    queryFn: getPendingVerification,
    retry: false,
  });

  const [prevRemainingTime, setPrevRemainingTime] = useState<number | undefined>(undefined);

  // Sync remaining time when pendingQuery data loads (during render to avoid cascading renders)
  if (
    pendingQuery.data?.remainingTime !== undefined &&
    pendingQuery.data.remainingTime !== prevRemainingTime
  ) {
    setPrevRemainingTime(pendingQuery.data.remainingTime);
    setTimeLeft(pendingQuery.data.remainingTime);
  }

  // Countdown timer for OTP expiration
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Countdown timer for resend cooldown
  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  // Mutation for verifying OTP
  const verifyMutation = useMutation({
    mutationFn: verifyEmail,
    onSuccess: (data) => {
      if (data.user) {
        queryClient.setQueryData<AuthResponse>(["auth"], {
          currentUser: data.user,
          userWishlist: [],
        });
        queryClient.invalidateQueries({ queryKey: ["auth"] });
      }
      navigate("/listings");
    },
  });

  // Mutation for resending OTP
  const resendMutation = useMutation({
    mutationFn: resendOTP,
    onSuccess: (data) => {
      setTimeLeft(data.remainingTime ?? 600);
      setCooldown(60);
      setFeedbackMessage(data.message || "New verification code sent!");
      setOtp("");
    },
    onError: (err) => {
      if (err instanceof AxiosError && err.response?.data) {
        const data = err.response.data as { message?: string; remainingCooldown?: number };
        if (data.remainingCooldown) {
          setCooldown(data.remainingCooldown);
        }
      }
    },
  });

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, "").slice(0, 6);
    setOtp(numericValue);

    if (verifyMutation.isError) {
      verifyMutation.reset();
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (otp.length !== 6) {
      setValidated(true);
      return;
    }

    setValidated(true);
    verifyMutation.mutate(otp);
  };

  const apiError =
    verifyMutation.error instanceof AxiosError
      ? (verifyMutation.error.response?.data as ApiErrorResponse)?.message
      : null;

  const resendError =
    resendMutation.error instanceof AxiosError
      ? (resendMutation.error.response?.data as ApiErrorResponse)?.message
      : null;

  // Handle loading state
  if (pendingQuery.isLoading) {
    return (
      <div className="container text-center mt-5 py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // If no pending verification in session, show option to sign up
  if (pendingQuery.isError || !pendingQuery.data) {
    return (
      <div className="container row mt-4">
        <div className="col-md-6 offset-md-3 text-center">
          <h3>No Pending Verification</h3>
          <p className="text-muted mt-2">
            No active email verification session found. Please sign up or request a new code.
          </p>
          <Link to="/signup" className="btn btn-color mt-3">
            Go to Sign Up
          </Link>
        </div>
      </div>
    );
  }

  const isExpired = timeLeft !== null && timeLeft <= 0;

  return (
    <div className="container row mt-3">
      <div className="col-md-6 offset-md-3">
        <h3>Verify Your Email</h3>
        <p className="text-muted">
          We've sent a 6-digit code to <strong>{pendingQuery.data.email}</strong>
        </p>

        {feedbackMessage && (
          <div className="alert alert-success py-2 small" role="alert">
            {feedbackMessage}
          </div>
        )}

        {resendError && (
          <div className="alert alert-danger py-2 small" role="alert">
            {resendError}
          </div>
        )}

        <form
          noValidate
          className={`needs-validation ${validated ? "was-validated" : ""}`}
          onSubmit={handleSubmit}
        >
          <div className="mb-3">
            <label htmlFor="otp" className="form-label">
              Enter Verification Code
            </label>

            <input
              type="text"
              className={`form-control ${apiError ? "is-invalid" : ""}`}
              id="otp"
              name="otp"
              placeholder="Enter 6-digit code"
              maxLength={6}
              pattern="[0-9]{6}"
              required
              autoFocus
              autoComplete="off"
              value={otp}
              onChange={handleOtpChange}
              disabled={isExpired || verifyMutation.isPending}
            />

            <div className="form-text mt-1">
              {!isExpired ? (
                <span>
                  <i className="bi bi-clock me-1" />
                  Code expires in <strong>{timeLeft}s</strong>
                </span>
              ) : (
                <span className="text-danger fw-bold">
                  <i className="bi bi-exclamation-triangle me-1" />
                  Code expired! Please resend or sign up again.
                </span>
              )}
            </div>

            <div className="invalid-feedback">
              {apiError || "Please enter the 6-digit verification code."}
            </div>
          </div>

          <div className="mb-3">
            <small className="text-muted">
              Didn't receive the code?{" "}
              {cooldown > 0 ? (
                <span className="text-muted">Wait {cooldown}s to resend</span>
              ) : (
                <button
                  type="button"
                  className="btn btn-link btn-sm p-0 text-decoration-none"
                  onClick={() => resendMutation.mutate()}
                  disabled={resendMutation.isPending}
                >
                  <i className="bi bi-arrow-clockwise me-1" />
                  {resendMutation.isPending ? "Sending..." : "Resend Code"}
                </button>
              )}
            </small>
          </div>

          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2">
            <button
              type="submit"
              className="btn btn-color"
              disabled={isExpired || otp.length !== 6 || verifyMutation.isPending}
            >
              <i className="bi bi-check-circle me-1" />
              {verifyMutation.isPending ? "Verifying..." : "Verify Email"}
            </button>

            <Link to="/signup" className="text-muted go-back text-decoration-none small">
              <i className="bi bi-caret-left-fill me-1" />
              Go Back
            </Link>
          </div>

          <div className="text-center mt-4">
            <small className="text-muted">
              <i className="bi bi-info-circle me-1" />
              Check your spam folder if you don't see the email.
            </small>
          </div>

          <br />
          <br />
        </form>
      </div>
    </div>
  );
}
