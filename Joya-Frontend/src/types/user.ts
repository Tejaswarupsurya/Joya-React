export type CurrentUser = {
  _id: string;
  username: string;
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
