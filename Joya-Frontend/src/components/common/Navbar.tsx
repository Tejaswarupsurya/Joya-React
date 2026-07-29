import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import type { CurrentUser } from "../../types/user";
import logo from "../../assets/logo.png";
import "./Navbar.css";

type NavbarProps = {
  currentUser?: CurrentUser | null;
};

const hiddenSearchRoutes = [
  "/login",
  "/signup",
  "/listings/new",
  "/forgot",
  "/update-password",
];

export default function Navbar({ currentUser }: NavbarProps) {
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const hideTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current !== null) {
        window.clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  const shouldShowSearch = !hiddenSearchRoutes.includes(location.pathname);

  const handleWishlistClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (location.pathname === "/dashboard") {
      event.preventDefault();

      const wishlistSection = document.getElementById("wishlistContainer");
      if (wishlistSection) {
        wishlistSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        const wishlistCard = wishlistSection.closest(
          ".mb-5",
        ) as HTMLElement | null;
        if (wishlistCard) {
          wishlistCard.style.transition = "all 0.3s ease";
          wishlistCard.style.transform = "scale(1.02)";
          wishlistCard.style.boxShadow = "0 8px 25px rgba(252, 56, 92, 0.15)";

          window.setTimeout(() => {
            wishlistCard.style.transform = "scale(1)";
            wishlistCard.style.boxShadow = "";
          }, 1000);
        }
      }
    }
  };

  // Functions to open or close the dropdown menu(IMP)
  const openDropdown = () => {
    if (hideTimeoutRef.current !== null) {
      window.clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }

    setDropdownOpen(true);
  };

  const closeDropdown = () => {
    hideTimeoutRef.current = window.setTimeout(() => {
      setDropdownOpen(false);
    }, 300);
  };

  const dashboardUrl =
    currentUser?.role === "admin"
      ? "/admin/dashboard"
      : currentUser?.role === "host"
        ? "/hosts/dashboard"
        : "/dashboard";

  const avatarSrc =
    currentUser?.role === "admin"
      ? "https://res.cloudinary.com/dcvaeebuf/image/upload/v1759743353/host1.jpg"
      : currentUser?.role === "host" && currentUser.host?.avatar?.url
        ? currentUser.host.avatar.url
        : null;

  return (
    <nav className="navbar navbar-expand-md bg-body-light border-bottom custom-sticky sticky-top">
      <div className="container-fluid">
        <Link className="navbar-brand mt-0" to="/listings">
          <img src={logo} alt="Joya" className="navbar-logo img-fluid" />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse joya-navbar-collapse"
          id="navbarNavAltMarkup"
        >
          <div className="navbar-nav">
            <Link className="nav-link underline-slide" to="/listings">
              Explore
            </Link>
          </div>

          {shouldShowSearch && (
            <div className="navbar-nav ms-auto">
              <form className="d-flex position-relative" role="search">
                <input
                  className="form-control me-2 search-input"
                  type="search"
                  id="search"
                  placeholder="Search destinations !"
                  autoComplete="off"
                />
                <button className="btn search-btn" type="submit">
                  <i className="bi bi-search me-2"></i>
                  <div>Search</div>
                </button>
              </form>
            </div>
          )}

          <div className="navbar-nav ms-auto joya-navbar-actions">
            {!currentUser ? (
              <>
                <Link className="nav-link signup" to="/signup">
                  <b>Sign Up</b>
                </Link>
                <Link className="nav-link login" to="/login">
                  <b>Log In</b>
                </Link>
              </>
            ) : (
              <>
                {currentUser.role === "user" && (
                  <Link className="nav-link underline-slide" to="/apply">
                    <i className="bi bi-person me-1"></i>Become a Host?
                  </Link>
                )}

                {currentUser.role === "host" &&
                  currentUser.host?.status === "approved" && (
                    <Link
                      className="nav-link underline-slide"
                      to="/listings/new"
                    >
                      Add your Home
                    </Link>
                  )}

                {currentUser.role === "host" &&
                  currentUser.host?.status === "pending" && (
                    <span className="nav-link navbar-status-pending">
                      <i className="bi bi-exclamation-triangle me-1"></i>
                      Awaiting Admin Approval
                    </span>
                  )}

                {currentUser.role === "host" &&
                  currentUser.host?.status === "rejected" && (
                    <Link
                      className="nav-link underline-slide navbar-status-rejected"
                      to="/apply"
                    >
                      <i className="bi bi-x-circle me-1"></i>Reapply as Host
                    </Link>
                  )}

                <Link
                  className="nav-link underline-slide me-3 dashboard-pill"
                  to={dashboardUrl}
                >
                  <i className="bi bi-speedometer2 me-1"></i>Dashboard
                </Link>

                <div
                  className="d-flex align-items-center gap-2 me-3"
                  onMouseEnter={openDropdown}
                  onMouseLeave={closeDropdown}
                >
                  <div className="dropdown">
                    <button
                      type="button"
                      className="user-avatar-wrapper d-flex align-items-center justify-content-center btn p-0 border-0"
                      id="userDropdown"
                      aria-expanded={dropdownOpen}
                      aria-haspopup="true"
                      aria-label={`${currentUser.username} menu`}
                      onClick={() => setDropdownOpen((value) => !value)}
                    >
                      {avatarSrc ? (
                        <img
                          src={avatarSrc}
                          alt={currentUser.username}
                          className="user-avatar-img"
                        />
                      ) : (
                        <div className="user-avatar-initials d-flex align-items-center justify-content-center text-white fw-bold">
                          {currentUser.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </button>

                    <ul
                      className={`dropdown-menu dropdown-menu-end${dropdownOpen ? " show" : ""}`}
                      aria-labelledby="userDropdown"
                    >
                      <li>
                        <Link className="dropdown-item" to={dashboardUrl}>
                          <i className="bi bi-person-circle me-2"></i>
                          {currentUser.username}
                        </Link>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>

                      {currentUser.role === "user" && (
                        <>
                          <li>
                            <a
                              className="dropdown-item"
                              href="/dashboard#wishlist"
                              onClick={handleWishlistClick}
                            >
                              <i className="bi bi-heart me-2"></i>My Wishlist
                            </a>
                          </li>
                          <li>
                            <hr className="dropdown-divider" />
                          </li>
                        </>
                      )}

                      <li>
                        <Link className="dropdown-item" to="/update-password">
                          <i className="bi bi-shield-lock me-2"></i>Change
                          Password
                        </Link>
                      </li>

                      <li>
                        <Link className="dropdown-item" to="/change-email">
                          <i className="bi bi-envelope-at me-2"></i>Update Email
                        </Link>
                      </li>

                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <a className="dropdown-item text-danger" href="/logout">
                          <i className="fa-solid fa-right-from-bracket me-2"></i>
                          Log out
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
