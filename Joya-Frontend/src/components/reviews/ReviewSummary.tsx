import type { StarBreakdown } from "../../types/review";
import "./ReviewSummary.css"

type ReviewSummaryProps = {
  avgRating: number;
  totalReviews: number;
  starBreakdown: StarBreakdown;
};

export default function ReviewSummary({
  avgRating,
  totalReviews,
  starBreakdown,
}: ReviewSummaryProps) {
  if (totalReviews === 0) return null;

  return (
    <>
      <hr />
      <div className="review-summary row mb-3">
        <h4>Review Summary</h4>
        <div className="col-md-7">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = starBreakdown[star as 1 | 2 | 3 | 4 | 5] || 0;
            const percentage = (count / totalReviews) * 100;

            return (
              <div key={star} className="d-flex align-items-center mb-1">
                <div className="me-2" style={{ width: "10px" }}>
                  {star}
                </div>
                <div className="progress flex-grow-1" style={{ height: "9px" }}>
                  <div
                    className="progress-bar bg-warning"
                    role="progressbar"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="col-md-5 text-center">
          <h2 className="mb-1">{avgRating.toFixed(1)}</h2>
          <p
            className="starability-result mx-auto mb-1"
            data-rating={Math.round(avgRating)}
          />
          <small className="text-primary">{totalReviews} reviews</small>
        </div>
      </div>
    </>
  );
}
