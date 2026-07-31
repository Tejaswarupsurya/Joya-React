import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import ListingsPage from "./pages/ListingsPage";
import NewListingPage from "./pages/NewListingPage";
import ListingDetailPage from "./pages/ListingDetailPage";
import EditListingPage from "./pages/EditListingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import UpdatePasswordPage from "./pages/UpdatePasswordPage";
import ChangeEmailPage from "./pages/ChangeEmailPage";
import UserDashboardPage from "./pages/UserDashboardPage";
import HostDashboardPage from "./pages/HostDashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import ApplyHostPage from "./pages/ApplyHostPage";
import NewBookingPage from "./pages/NewBookingPage";
import BookingDetailPage from "./pages/BookingDetailPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import PaymentCancelPage from "./pages/PaymentCancelPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/listings" replace />} />
        <Route path="/listings" element={<ListingsPage />} />
        <Route path="/listings/new" element={<NewListingPage />} />
        <Route path="/listings/:id" element={<ListingDetailPage />} />
        <Route path="/listings/:id/edit" element={<EditListingPage />} />
        <Route path="/listings/:id/bookings/new" element={<NewBookingPage />} />
        <Route path="/listings/:id/bookings/:bookingId" element={<BookingDetailPage />} />
        <Route path="/payments/success" element={<PaymentSuccessPage />} />
        <Route path="/payments/cancel" element={<PaymentCancelPage />} />
        <Route path="/dashboard" element={<UserDashboardPage />} />
        <Route path="/host/dashboard" element={<HostDashboardPage />} />
        <Route path="/hosts/dashboard" element={<Navigate to="/host/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/apply" element={<ApplyHostPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/forgot" element={<ForgotPasswordPage />} />
        <Route path="/update-password" element={<UpdatePasswordPage />} />
        <Route path="/change-email" element={<ChangeEmailPage />} />
      </Route>
    </Routes>
  );
}

export default App;
