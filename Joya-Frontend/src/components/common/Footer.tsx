import { Link } from "react-router-dom";
import type { CurrentUser } from "../../types/user";
import "./Footer.css";

type FooterProps = {
  currentUser?: CurrentUser | null;
};

export default function Footer({ currentUser }: FooterProps) {
  return (
    <footer className="border-top mt-5 pt-4 pb-2 bg-white">
      <div className="container">
        <div className="row text-muted small">
          <div className="support col-sm-6 col-md-3 mb-2">
            <h6 className="fw-bold text-dark">Support</h6>
            <ul className="list-unstyled">
              <li>
                <Link
                  to="/info/help-center"
                  className="text-muted text-decoration-none underline-slide"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  to="/info/faq"
                  className="text-muted text-decoration-none underline-slide"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  to="/info/contact"
                  className="text-muted text-decoration-none underline-slide"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/info/safety"
                  className="text-muted text-decoration-none underline-slide"
                >
                  Safety & Security
                </Link>
              </li>
              <li>
                <Link
                  to="/info/accessibility"
                  className="text-muted text-decoration-none underline-slide"
                >
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>

          <div className="hosting col-sm-6 col-md-3 mb-2">
            <h6 className="fw-bold text-dark">Hosting</h6>
            <ul className="list-unstyled">
              <li>
                <Link
                  to="/listings/new"
                  className="text-muted text-decoration-none underline-slide"
                >
                  Add your Home
                </Link>
              </li>
              <li>
                <Link
                  to="/info/host-guide"
                  className="text-muted text-decoration-none underline-slide"
                >
                  Host Guide
                </Link>
              </li>
              {!currentUser ? (
                <>
                  <li>
                    <Link
                      to="/signup"
                      className="text-muted text-decoration-none underline-slide"
                    >
                      Signup
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/login"
                      className="text-muted text-decoration-none underline-slide"
                    >
                      Login
                    </Link>
                  </li>
                </>
              ) : (
                <li>
                  <a
                    href="/logout"
                    className="text-muted text-decoration-none underline-slide"
                  >
                    Logout
                  </a>
                </li>
              )}
            </ul>
          </div>

          <div className="company col-sm-6 col-md-3 mb-2">
            <h6 className="fw-bold text-dark">Company</h6>
            <ul className="list-unstyled">
              <li>
                <Link
                  to="/info/company-info"
                  className="text-muted text-decoration-none underline-slide"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/info/careers"
                  className="text-muted text-decoration-none underline-slide"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  to="/info/community"
                  className="text-muted text-decoration-none underline-slide"
                >
                  Community
                </Link>
              </li>
              <li>
                <Link
                  to="/info/sitemap"
                  className="text-muted text-decoration-none underline-slide"
                >
                  Sitemap
                </Link>
              </li>
            </ul>
          </div>

          <div className="legal col-sm-6 col-md-3 mb-2">
            <h6 className="fw-bold text-dark">Legal</h6>
            <ul className="list-unstyled">
              <li>
                <Link
                  to="/info/terms"
                  className="text-muted text-decoration-none underline-slide"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  to="/info/privacy"
                  className="text-muted text-decoration-none underline-slide"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-muted small text-center mt-0">
          Powered by{" "}
          <a
            href="https://www.mapbox.com/"
            target="_blank"
            rel="noreferrer"
            className="text-dark"
          >
            Mapbox
          </a>
          ,{" "}
          <a
            href="https://www.getbootstrap.com/"
            target="_blank"
            rel="noreferrer"
            className="text-dark"
          >
            Bootstrap
          </a>
          ,{" "}
          <a
            href="https://cloudinary.com/"
            target="_blank"
            rel="noreferrer"
            className="text-dark"
          >
            Cloudinary
          </a>
          ,{" "}
          <a
            href="http://www.passportjs.org/"
            target="_blank"
            rel="noreferrer"
            className="text-dark"
          >
            Passport.js
          </a>
          ,{" "}
          <a
            href="https://jestjs.io/"
            target="_blank"
            rel="noreferrer"
            className="text-dark"
          >
            Jest
          </a>
          <span className="fw-light ms-2">Last updated: December 2025</span>
        </div>

        <div className="border-top d-flex flex-column flex-sm-row align-items-center justify-content-between f-bar mt-3 pt-2 gap-2 text-center">
          <div className="d-flex flex-wrap align-items-center justify-content-center gap-2">
            <span>&copy; 2025 Joya, Inc.</span>
            <Link
              to="/info/privacy"
              className="text-muted text-decoration-none underline-slide"
            >
              . Privacy
            </Link>
            <Link
              to="/info/terms"
              className="text-muted text-decoration-none underline-slide"
            >
              . Terms
            </Link>
          </div>

          <div className="d-flex align-items-center justify-content-center gap-3 f-icons">
            <button className="lang btn-sm" type="button">
              <i className="bi bi-globe"></i>English(IN)
            </button>
            <a
              href="https://www.linkedin.com/in/surya-tejaswarup-a12461280/"
              className="text-muted fs-6"
              target="_blank"
              rel="noreferrer"
            >
              <i className="bi bi-linkedin"></i>
            </a>
            <a
              href="https://github.com/Tejaswarupsurya/Joya"
              className="text-muted fs-6"
              target="_blank"
              rel="noreferrer"
            >
              <i className="bi bi-github"></i>
            </a>
            <a
              href="https://www.instagram.com/tejaswarupsurya/"
              className="text-muted fs-6"
              target="_blank"
              rel="noreferrer"
            >
              <i className="bi bi-instagram"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
