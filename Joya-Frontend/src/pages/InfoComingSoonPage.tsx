import { Link, useParams } from "react-router-dom";

const PAGE_TITLES: Record<string, string> = {
  "help-center": "Help Center",
  faq: "Frequently Asked Questions",
  terms: "Terms of Service",
  privacy: "Privacy Policy",
  sitemap: "Sitemap",
  "company-info": "About Joya",
  contact: "Contact Us",
  careers: "Careers at Joya",
  "host-guide": "Host Guide",
  safety: "Safety & Security",
  accessibility: "Accessibility",
  community: "Community Standards",
};

export default function InfoComingSoonPage() {
  const { page } = useParams<{ page: string }>();
  const title = PAGE_TITLES[page ?? ""] ?? "This Page";

  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "2rem",
        background: "linear-gradient(135deg, #f8f9ff 0%, #fff 50%)",
      }}
    >
      {/* Animated icon */}
      <div
        style={{
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "3.5rem",
          marginBottom: "2rem",
          boxShadow: "0 12px 40px rgba(102, 126, 234, 0.35)",
          animation: "pulseAnim 2.5s ease-in-out infinite",
        }}
      >
        🚧
      </div>

      {/* Title */}
      <h1
        style={{
          fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
          fontWeight: 800,
          color: "#212529",
          marginBottom: "0.5rem",
        }}
      >
        {title}
      </h1>

      {/* Coming soon badge */}
      <span
        style={{
          display: "inline-block",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "#fff",
          fontWeight: 700,
          fontSize: "0.75rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          padding: "0.35em 1em",
          borderRadius: "50px",
          marginBottom: "1.5rem",
        }}
      >
        Coming Soon
      </span>

      {/* Description */}
      <p
        style={{
          color: "#6c757d",
          fontSize: "1.1rem",
          maxWidth: "500px",
          lineHeight: 1.7,
          marginBottom: "2.5rem",
        }}
      >
        We're crafting this page to give you the best experience possible.
        <br />
        It'll be ready very soon — stay tuned! 🎉
      </p>

      {/* Progress bar decoration */}
      <div
        style={{
          width: "280px",
          height: "6px",
          background: "#e9ecef",
          borderRadius: "50px",
          overflow: "hidden",
          marginBottom: "2.5rem",
        }}
      >
        <div
          style={{
            height: "100%",
            width: "65%",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: "50px",
            animation: "progressAnim 2s ease-in-out infinite alternate",
          }}
        />
      </div>

      {/* Actions */}
      <div className="d-flex flex-wrap gap-3 justify-content-center">
        <Link
          to="/listings"
          className="btn btn-lg btn-color px-5"
          style={{ borderRadius: "50px", fontWeight: 600 }}
        >
          <i className="bi bi-house-heart me-2" />
          Explore Listings
        </Link>
        <Link
          to="/"
          className="btn btn-lg btn-outline-secondary px-5"
          style={{ borderRadius: "50px", fontWeight: 600 }}
        >
          <i className="bi bi-arrow-left me-2" />
          Go Home
        </Link>
      </div>

      <style>{`
        @keyframes pulseAnim {
          0%, 100% { transform: scale(1); box-shadow: 0 12px 40px rgba(102,126,234,0.35); }
          50% { transform: scale(1.05); box-shadow: 0 16px 50px rgba(102,126,234,0.5); }
        }
        @keyframes progressAnim {
          0% { width: 50%; }
          100% { width: 80%; }
        }
      `}</style>
    </div>
  );
}
