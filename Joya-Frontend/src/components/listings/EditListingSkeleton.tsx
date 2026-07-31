export default function EditListingSkeleton() {
  return (
    <div className="container row mt-3 mx-auto placeholder-glow">
      <div className="col-8 offset-2">
        <span className="placeholder col-4 fs-3 mb-3 d-block rounded" />

        <div className="mb-3">
          <span className="placeholder col-2 mb-2 d-block rounded" />
          <span className="placeholder col-12 py-3 rounded d-block" />
        </div>

        <div className="mb-3">
          <span className="placeholder col-3 mb-2 d-block rounded" />
          <span className="placeholder col-12 py-4 rounded d-block" />
        </div>

        <div className="mb-3">
          <span className="placeholder col-3 mb-2 d-block rounded" />
          <span
            className="placeholder col-6 rounded d-block bg-secondary"
            style={{ height: "180px" }}
          />
        </div>

        <div className="mb-3">
          <span className="placeholder col-3 mb-2 d-block rounded" />
          <span className="placeholder col-12 py-3 rounded d-block" />
        </div>

        <div className="mb-3">
          <span className="placeholder col-3 mb-2 d-block rounded" />
          <span className="placeholder col-12 py-3 rounded d-block" />
        </div>

        <div className="row">
          <div className="mb-3 col-md-4">
            <span className="placeholder col-4 mb-2 d-block rounded" />
            <span className="placeholder col-12 py-3 rounded d-block" />
          </div>
          <div className="mb-3 col-md-8">
            <span className="placeholder col-4 mb-2 d-block rounded" />
            <span className="placeholder col-12 py-3 rounded d-block" />
          </div>
        </div>

        <div className="mb-3">
          <span className="placeholder col-3 mb-2 d-block rounded" />
          <span className="placeholder col-12 py-3 rounded d-block" />
        </div>

        <div className="d-flex justify-content-between align-items-center mt-4">
          <span className="placeholder col-3 py-3 rounded d-block" />
          <span className="placeholder col-2 py-3 rounded d-block" />
        </div>
      </div>
    </div>
  );
}
