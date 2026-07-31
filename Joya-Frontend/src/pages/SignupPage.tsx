import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

import {
  type SignupCredentials,
  type SignupErrorResponse,
} from "../types/user";

import { signup } from "../api/auth";

export default function SignupPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<SignupCredentials>({
    username: "",
    email: "",
    password: "",
    confirm: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [validated, setValidated] = useState(false);

  const signupMutation = useMutation({
    mutationFn: signup,

    onSuccess: (data) => {
      toast.success(data.message || "Verification code sent to your email!");
      navigate("/verify-email");
    },

    onError: (error) => {
      if (error instanceof AxiosError && !error.response) {
        toast.error("Network error. Please check your connection and try again.");
      }
    },
  });

  const apiError =
    signupMutation.error instanceof AxiosError
      ? (signupMutation.error.response?.data as SignupErrorResponse)
      : null;

  const fieldErrors = apiError?.errors;

  const passwordsFilled =
    formData.password.length > 0 && formData.confirm.length > 0;

  const passwordsMatch =
    passwordsFilled && formData.password === formData.confirm;

  const passwordsMismatch =
    passwordsFilled && formData.password !== formData.confirm;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (signupMutation.isError) {
      signupMutation.reset();
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;

    if (!form.checkValidity()) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    // Extra application-level validation because HTML cannot
    // determine whether two separate fields have equal values.
    if (!passwordsMatch) {
      return;
    }

    setValidated(true);

    signupMutation.mutate(formData);
  };

  return (
    <div className="container row mt-3">
      <div className="col-6 offset-3">
        <h3>Sign Up to Joya</h3>

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
              className={`form-control ${
                fieldErrors?.username ? "is-invalid" : ""
              }`}
              required
              value={formData.username}
              onChange={handleChange}
            />

            <div className="valid-feedback">Looks Good!</div>

            <div className="invalid-feedback">
              {fieldErrors?.username || "Please enter a username."}
            </div>
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
              className={`form-control ${
                fieldErrors?.email ? "is-invalid" : ""
              }`}
              required
              value={formData.email}
              onChange={handleChange}
            />

            <div className="valid-feedback">Looks Good!</div>

            <div className="invalid-feedback">
              {fieldErrors?.email || "Please enter a valid email address."}
            </div>
          </div>

          {/* Password */}
          <div className="mb-3 position-relative">
            <label htmlFor="password" className="form-label">
              Password
            </label>

            <input
              name="password"
              id="password"
              type={showPassword ? "text" : "password"}
              className={`form-control password-input ${
                fieldErrors?.password ? "is-invalid" : ""
              }`}
              required
              value={formData.password}
              onChange={handleChange}
            />

            <i
              className={`bi ${
                showPassword ? "bi-eye" : "bi-eye-slash"
              } eye-toggle`}
              onClick={() => setShowPassword((previous) => !previous)}
              role="button"
            />

            <div className="valid-feedback">Looks Good!</div>

            <div className="invalid-feedback">
              {fieldErrors?.password || "Please enter a password."}
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
                fieldErrors?.confirm
                  ? "is-invalid"
                  : passwordsMatch
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
              {fieldErrors?.confirm ||
                (passwordsMismatch
                  ? "Passwords do not match."
                  : "Please confirm your password.")}
            </div>
          </div>

          {/* Terms */}
          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="terms"
              required
            />

            <label className="form-check-label" htmlFor="terms">
              I agree to the{" "}
              <Link to="/info/terms" target="_blank">
                Terms and Conditions
              </Link>
            </label>

            <div className="invalid-feedback">
              You must agree before signing up.
            </div>
          </div>

          {/* Non-field API error */}
          {apiError?.message && !fieldErrors && (
            <div className="text-danger small mb-3">{apiError.message}</div>
          )}

          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2">
            <button
              id="submitBtn"
              type="submit"
              className="btn btn-color"
              disabled={passwordsMismatch || signupMutation.isPending}
            >
              {signupMutation.isPending
                ? "Sending verification code..."
                : "Sign Up"}
            </button>

            <Link to="/login" className="text-decoration-none small text-muted">
              Already have an account? Login
            </Link>
          </div>

          <br />
          <br />
        </form>
      </div>
    </div>
  );
}
