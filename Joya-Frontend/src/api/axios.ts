import axios from "axios";

// In development: Vite proxy forwards /api → localhost:3000 (no env var needed)
// In production (Vercel): set VITE_API_BASE_URL to your EC2 backend URL
// e.g. VITE_API_BASE_URL=http://44.223.41.189 (or https://api.yourjoya.com)
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
    ? `${import.meta.env.VITE_API_BASE_URL}/api`
    : "/api",
  withCredentials: true,
});
