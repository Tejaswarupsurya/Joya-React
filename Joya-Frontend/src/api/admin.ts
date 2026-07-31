import { api } from "./axios";

export type HostApplication = {
  _id: string;
  username: string;
  email: string;
  role: string;
  host?: {
    fullName?: string;
    phone?: string;
    aadhaar?: string;
    avatar?: {
      url?: string;
      filename?: string;
    };
    status: "pending" | "approved" | "rejected";
    appliedAt?: string;
    approvedAt?: string;
  };
};

export type AdminDashboardResponse = {
  success: boolean;
  applications: HostApplication[];
};

export type ApproveRejectResponse = {
  success: boolean;
  message: string;
};

export const getAdminDashboard = async (): Promise<AdminDashboardResponse> => {
  const response = await api.get<AdminDashboardResponse>("/admin/dashboard");
  return response.data;
};

export const approveHostApplication = async (
  userId: string
): Promise<ApproveRejectResponse> => {
  const response = await api.post<ApproveRejectResponse>(
    `/admin/${userId}/approve`
  );
  return response.data;
};

export const rejectHostApplication = async (
  userId: string
): Promise<ApproveRejectResponse> => {
  const response = await api.post<ApproveRejectResponse>(
    `/admin/${userId}/reject`
  );
  return response.data;
};
