import { api } from "./axios";
import type {
  AuthResponse,
  LoginResponse,
  LoginCredentials,
  SignupCredentials,
  SignupResponse,
  PendingVerificationResponse,
  VerifyEmailResponse,
  ResendOTPResponse,
  SendForgotOTPPayload,
  SendForgotOTPResponse,
  ForgotPasswordPayload,
  ForgotPasswordResponse,
  UpdatePasswordPayload,
  UpdatePasswordResponse,
  ChangeEmailPayload,
  ChangeEmailResponse,
  LogoutResponse,
} from "../types/user";

export const getCurrentUser = async (): Promise<AuthResponse> => {
  const response = await api.get<AuthResponse>("/auth/me");

  return response.data;
};

export const login = async (
  credentials: LoginCredentials,
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/auth/login", credentials);

  return response.data;
};

export const logout = async (): Promise<LogoutResponse> => {
  const response = await api.post<LogoutResponse>("/auth/logout");

  return response.data;
};

export const signup = async (
  credentials: SignupCredentials,
): Promise<SignupResponse> => {
  const response = await api.post<SignupResponse>("/auth/signup", credentials);

  return response.data;
};

export const getPendingVerification = async (): Promise<PendingVerificationResponse> => {
  const response = await api.get<PendingVerificationResponse>(
    "/auth/pending-verification",
  );

  return response.data;
};

export const verifyEmail = async (otp: string): Promise<VerifyEmailResponse> => {
  const response = await api.post<VerifyEmailResponse>("/auth/verify-email", {
    otp,
  });

  return response.data;
};

export const resendOTP = async (): Promise<ResendOTPResponse> => {
  const response = await api.post<ResendOTPResponse>("/auth/resend-otp");

  return response.data;
};

export const sendForgotOTP = async (
  payload: SendForgotOTPPayload,
): Promise<SendForgotOTPResponse> => {
  const response = await api.post<SendForgotOTPResponse>(
    "/auth/send-forgot-otp",
    payload,
  );

  return response.data;
};

export const forgotPassword = async (
  payload: ForgotPasswordPayload,
): Promise<ForgotPasswordResponse> => {
  const response = await api.post<ForgotPasswordResponse>(
    "/auth/forgot-password",
    payload,
  );

  return response.data;
};

export const updatePassword = async (
  payload: UpdatePasswordPayload,
): Promise<UpdatePasswordResponse> => {
  const response = await api.post<UpdatePasswordResponse>(
    "/auth/update-password",
    payload,
  );

  return response.data;
};

export const changeEmail = async (
  payload: ChangeEmailPayload,
): Promise<ChangeEmailResponse> => {
  const response = await api.post<ChangeEmailResponse>(
    "/auth/change-email",
    payload,
  );

  return response.data;
};