import { Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

export default function MainLayout() {
  const { data: authData } = useAuth();

  const currentUser = authData?.currentUser ?? null;
  const userWishlist = authData?.userWishlist ?? [];

  return (
    <div className="main-layout">
      <Navbar currentUser={currentUser} />

      <main className="container main-layout-content">
        <Outlet context={{ currentUser, userWishlist }} />
      </main>

      <Footer currentUser={currentUser} />
    </div>
  );
}
