export type CurrentUser = {
  _id: string;
  username: string;
  email: string;
  role: "user" | "host" | "admin";

  host?: {
    status?: "none" | "approved" | "pending" | "rejected";
    avatar?: {
      url?: string;
    };
  };
};

export type AuthResponse = {
  currentUser: CurrentUser | null;
  userWishlist: string[];
};

export type LoginResponse = {
  success: boolean;
  message: string;
  user: CurrentUser;
};

export type LogoutResponse = {
  success: boolean;
  message: string;
}

export type LoginCredentials = {
  username: string;
  password: string;
};

export type SignupCredentials = {
  username: string;
  email: string;
  password: string;
  confirm: string;
};

export type SignupResponse = {
  success: boolean;
  message: string;
  email: string;
};

export type SignupErrorResponse = {
  success: false;
  message: string;
  errors?: Partial<Record<keyof SignupCredentials, string>>;
};

export type PendingVerificationResponse = {
  success: boolean;
  email: string;
  remainingTime: number;
  canResend: boolean;
};

export type VerifyEmailResponse = {
  success: boolean;
  message: string;
  user?: CurrentUser;
};

export type ResendOTPResponse = {
  success: boolean;
  message: string;
  remainingTime: number;
  canResend: boolean;
};

export type SendForgotOTPPayload = {
  username: string;
  email: string;
};

export type SendForgotOTPResponse = {
  success: boolean;
  message: string;
  remainingCooldown?: number;
};

export type ForgotPasswordPayload = {
  username: string;
  email: string;
  code: string;
  password: string;
  confirm: string;
};

export type ForgotPasswordResponse = {
  success: boolean;
  message: string;
};

export type UpdatePasswordPayload = {
  currentPassword: string;
  password: string;
  confirm: string;
};

export type UpdatePasswordResponse = {
  success: boolean;
  message: string;
};

export type ChangeEmailPayload = {
  newEmail: string;
  password: string;
};

export type ChangeEmailResponse = {
  success: boolean;
  message: string;
  user?: CurrentUser;
};
