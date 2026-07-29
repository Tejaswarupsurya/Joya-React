import "./NoResults.css";

export default function NoResults() {
    return (
      <div
        className="container-fluid d-flex justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <div className="no-results-container">
          <div className="no-results-illustration">
            <div className="search-icon-art">
              <i className="bi bi-search"></i>

              <div className="search-decorative">
                <div className="search-circle"></div>
                <div className="search-circle"></div>
                <div className="search-circle"></div>
              </div>
            </div>

            <div className="search-dots">
              <div className="search-dot"></div>
              <div className="search-dot"></div>
              <div className="search-dot"></div>
            </div>
          </div>

          <div className="no-results-text">
            <h2>No stays found!</h2>

            <p>
              We couldn't find any properties matching your search. Try
              adjusting your filters or search for different keywords.
            </p>
          </div>
        </div>
      </div>
    );
}