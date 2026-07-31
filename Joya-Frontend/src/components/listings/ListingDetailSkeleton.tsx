export default function ListingDetailSkeleton() {
  return (
    <div className="container mt-3 placeholder-glow" aria-hidden="true">
      <div className="row">
        <div className="col-12 col-md-8 offset-md-2">
          {/* Title Skeleton */}
          <h3 className="mb-3">
            <span className="placeholder col-7 py-3 rounded" />
          </h3>

          {/* Listing Card Skeleton */}
          <div className="card listing-card show-card mb-4">
            <div
              className="placeholder show-img rounded-top"
              style={{
                height: "350px",
                backgroundColor: "#dee2e6",
              }}
            />
            <div className="card-body">
              <p className="card-text mb-2">
                <span className="placeholder col-4" />
              </p>
              <p className="card-text mb-3">
                <span className="placeholder col-12" />
                <span className="placeholder col-10" />
                <span className="placeholder col-6" />
              </p>
              <p className="card-text mb-2">
                <span className="placeholder col-3" />
              </p>
              <p className="card-text mb-2">
                <span className="placeholder col-5" />
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
