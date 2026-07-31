export default function PaymentStatusSkeleton() {
  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-lg-7 col-md-9 placeholder-glow">
          <div
            className="card border-0 shadow-sm"
            style={{ borderRadius: "15px" }}
          >
            <div className="card-body p-4 p-md-5 text-center">
              {/* Icon placeholder */}
              <div className="d-flex justify-content-center mb-4">
                <span
                  className="placeholder rounded-circle bg-secondary"
                  style={{ width: "80px", height: "80px" }}
                />
              </div>

              {/* Title & subtitle placeholder */}
              <span className="placeholder col-6 fs-2 mb-2 d-block mx-auto rounded" />
              <span className="placeholder col-8 mb-4 d-block mx-auto rounded" />

              {/* Details card placeholder */}
              <div className="bg-light rounded p-4 mb-4 text-start">
                <span className="placeholder col-4 fs-5 mb-3 d-block rounded" />
                <span className="placeholder col-10 mb-2 d-block rounded" />
                <span className="placeholder col-8 mb-2 d-block rounded" />
                <span className="placeholder col-6 mb-2 d-block rounded" />
                <hr className="my-3" />
                <span className="placeholder col-5 fs-5 d-block rounded" />
              </div>

              {/* Buttons placeholder */}
              <div className="d-flex justify-content-center gap-2">
                <span
                  className="placeholder col-4 py-3 rounded"
                  style={{ display: "inline-block" }}
                />
                <span
                  className="placeholder col-4 py-3 rounded"
                  style={{ display: "inline-block" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
