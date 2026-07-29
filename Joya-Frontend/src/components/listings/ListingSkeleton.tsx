export default function ListingSkeleton() {
  return (
    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div className="col placeholder-glow" aria-hidden="true" key={index}>
          <div className="card listing-card">
            <div
              className="placeholder"
              style={{
                height: "180px",
                backgroundColor: "#dee2e6",
              }}
            />

            <div className="card-body">
              <p className="card-text">
                <span className="placeholder col-6" />
                <br />
                <span className="placeholder col-4" />
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
