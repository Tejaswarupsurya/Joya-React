import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient} from "@tanstack/react-query";
import { AxiosError } from "axios";

import { login } from "../api/auth";
import type { AuthResponse } from "../types/user";

type LoginErrorResponse = {
  success: false;
  message: string;
};

export default function LoginPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [validated, setValidated] = useState(false);

  const loginMutation = useMutation({
    mutationFn: login,

    onSuccess: (data) => {
      queryClient.setQueryData<AuthResponse>(["auth"], {
        currentUser: data.user,
        userWishlist: [],
      });
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      navigate("/listings");
    },

    onError: () => {
      queryClient.clear();
    }
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;

    // Browser validation: required, type, pattern, minLength, etc.
    if (!form.checkValidity()) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    setValidated(true);

    loginMutation.mutate({
      username,
      password,
    });
  };

  const errorMessage =
    loginMutation.error instanceof AxiosError
      ? (loginMutation.error.response?.data as LoginErrorResponse)?.message
      : null;

  return (
    <div className="container row mt-3">
      <div className="col-6 offset-3">
        <h3>Login to Joya</h3>

        <form
          noValidate
          className={`needs-validation ${validated ? "was-validated" : ""}`}
          onSubmit={handleSubmit}
        >
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>

            <input
              name="username"
              className="form-control"
              id="username"
              type="text"
              required
              value={username}
              onChange={(event) => {
                setUsername(event.target.value);

                if (loginMutation.isError) {
                  loginMutation.reset();
                }
              }}
            />

            <div className="valid-feedback">Looks Good!</div>

            <div className="invalid-feedback">Please enter your username.</div>
          </div>

          <div className="mb-1 position-relative">
            <label htmlFor="password" className="form-label">
              Password
            </label>

            <input
              name="password"
              className="form-control"
              id="password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);

                if (loginMutation.isError) {
                  loginMutation.reset();
                }
              }}
            />

            <i
              className={`bi ${
                showPassword ? "bi-eye" : "bi-eye-slash"
              } eye-toggle`}
              onClick={() => setShowPassword((previous) => !previous)}
              role="button"
            />

            <div className="valid-feedback">Looks Good!</div>

            <div className="invalid-feedback">Please enter your password.</div>
          </div>

          {errorMessage && (
            <div className="text-danger small mt-2">{errorMessage}</div>
          )}

          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center mb-3 gap-2">
            <Link
              to="/forgot"
              className="text-decoration-none small text-muted"
            >
              Forgot Password?
            </Link>

            <Link
              to="/signup"
              className="text-decoration-none small text-muted"
            >
              New to Joya? Create an account
            </Link>
          </div>

          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2">
            <button
              className="btn btn-color"
              type="submit"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Logging in..." : "Login"}
            </button>

            <Link to="/listings" className="text-muted go-back">
              <i className="bi bi-caret-left-fill" />
              Go Back
            </Link>
          </div>

          <div className="text-center mt-3">
            <small className="text-muted">
              Need help? Visit our{" "}
              <Link
                to="/info/help-center"
                target="_blank"
                className="text-primary"
              >
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
