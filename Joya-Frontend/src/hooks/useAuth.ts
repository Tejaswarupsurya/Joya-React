import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../api/auth";

export const useAuth = () => {
  return useQuery({
    queryKey: ["auth"],
    queryFn: getCurrentUser,
  });
};
