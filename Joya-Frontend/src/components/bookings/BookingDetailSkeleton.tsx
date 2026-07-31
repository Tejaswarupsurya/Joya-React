export default function BookingDetailSkeleton() {
  return (
    <div className="container mt-3">
      <div className="col-12 col-md-8 offset-md-2 placeholder-glow">
        <span className="placeholder col-4 fs-3 mb-3 d-block rounded" />

        {/* Card Skeleton */}
        <div className="card booking-card mb-3 border-0 shadow-sm" style={{ borderRadius: "12px", overflow: "hidden" }}>
          <div
            className="placeholder col-12 bg-secondary"
            style={{ height: "300px", display: "block" }}
          />

          <div className="card-body">
            <span className="placeholder col-6 fs-4 mb-2 d-block rounded" />
            <span className="placeholder col-4 mb-3 d-block rounded" />

            <div className="mb-2">
              <span className="placeholder col-5 d-block rounded mb-1" />
              <span className="placeholder col-5 d-block rounded mb-1" />
              <span className="placeholder col-3 d-block rounded" />
            </div>

            <hr />

            <div className="d-flex align-items-center justify-content-between">
              <span className="placeholder col-3 fs-5 rounded" />
              <span className="placeholder col-2 p-2 rounded-pill" />
            </div>
          </div>
        </div>

        {/* Map Skeleton */}
        <div className="mt-4">
          <hr />
          <span className="placeholder col-4 fs-4 mb-2 d-block rounded" />
          <div
            className="placeholder col-12 rounded"
            style={{ height: "300px", display: "block" }}
          />
        </div>
      </div>
    </div>
  );
}
