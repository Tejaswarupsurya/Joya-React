import { Link, useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

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
        background: "linear-gradient(135deg, #fff5f6 0%, #fff 60%)",
      }}
    >
      {/* Animated 404 number */}
      <div
        style={{
          fontSize: "clamp(6rem, 20vw, 12rem)",
          fontWeight: 900,
          lineHeight: 1,
          background: "linear-gradient(135deg, #fc385c 0%, #ff6b6b 50%, #ffd93d 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          letterSpacing: "-0.05em",
          marginBottom: "0.5rem",
          animation: "floatAnim 3s ease-in-out infinite",
          userSelect: "none",
        }}
      >
        404
      </div>

      {/* Icon */}
      <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
        <i className="bi bi-map" style={{ color: "#fc385c", opacity: 0.6 }} />
      </div>

      {/* Heading */}
      <h1
        style={{
          fontSize: "clamp(1.5rem, 4vw, 2.2rem)",
          fontWeight: 700,
          color: "#212529",
          marginBottom: "0.75rem",
        }}
      >
        Page Not Found
      </h1>

      {/* Subtext */}
      <p
        style={{
          color: "#6c757d",
          fontSize: "1.1rem",
          maxWidth: "480px",
          lineHeight: 1.6,
          marginBottom: "2.5rem",
        }}
      >
        Looks like this page packed its bags and went on vacation.
        <br />
        Let's get you back somewhere familiar.
      </p>

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
        <button
          onClick={() => navigate(-1)}
          className="btn btn-lg btn-outline-secondary px-5"
          style={{ borderRadius: "50px", fontWeight: 600 }}
        >
          <i className="bi bi-arrow-left me-2" />
          Go Back
        </button>
      </div>

      {/* Floating animation keyframes injected inline */}
      <style>{`
        @keyframes floatAnim {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
      `}</style>
    </div>
  );
}
