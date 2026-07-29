import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { facilities } from "../../constants/facilities";

export default function FilterModal() {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeFilterCount =
    (searchParams.get("minPrice") ? 1 : 0) +
    (searchParams.get("maxPrice") ? 1 : 0) +
    searchParams.getAll("facilities").length +
    (searchParams.get("sortBy") ? 1 : 0);

  const [minPrice, setMinPrice] = useState(
    () => searchParams.get("minPrice") ?? "",
  );
  const [maxPrice, setMaxPrice] = useState(
    () => searchParams.get("maxPrice") ?? "",
  );
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>(
    () => searchParams.getAll("facilities"),
  );
  const [sortBy, setSortBy] = useState(() => searchParams.get("sortBy") ?? "");

  const syncFiltersFromUrl = () => {
    setMinPrice(searchParams.get("minPrice") ?? "");
    setMaxPrice(searchParams.get("maxPrice") ?? "");
    setSelectedFacilities(searchParams.getAll("facilities"));
    setSortBy(searchParams.get("sortBy") ?? "");
  };

  const handleFacilityChange = (facility: string) => {
    setSelectedFacilities((previous) =>
      previous.includes(facility)
        ? previous.filter((item) => item !== facility)
        : [...previous, facility],
    );
  };

  const handleApply = () => {
    setSearchParams((params) => {
      // Price
      if (minPrice) {
        params.set("minPrice", minPrice);
      } else {
        params.delete("minPrice");
      }

      if (maxPrice) {
        params.set("maxPrice", maxPrice);
      } else {
        params.delete("maxPrice");
      }

      // Facilities
      params.delete("facilities");

      selectedFacilities.forEach((facility) => {
        params.append("facilities", facility);
      });

      // Sorting
      if (sortBy) {
        params.set("sortBy", sortBy);
      } else {
        params.delete("sortBy");
      }

      return params;
    });
  };

  const handleClear = () => {
    setMinPrice("");
    setMaxPrice("");
    setSelectedFacilities([]);
    setSortBy("");

    setSearchParams((params) => {
      params.delete("minPrice");
      params.delete("maxPrice");
      params.delete("facilities");
      params.delete("sortBy");

      return params;
    });
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-outline d-none d-lg-flex align-items-center gap-2 ms-3 filterBtn"
        data-bs-toggle="modal"
        data-bs-target="#filterModal"
        onClick={syncFiltersFromUrl}
      >
        <i className="bi bi-sliders" />
        Filters
        {activeFilterCount >= 0 && (
          <span className="badge rounded-pill bg-danger">
            {activeFilterCount}
          </span>
        )}
      </button>

      <div
        className="modal fade"
        id="filterModal"
        tabIndex={-1}
        aria-labelledby="filterModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content rounded-4">
            <div className="modal-header">
              <h5 className="modal-title" id="filterModalLabel">
                Filters
              </h5>

              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>

            <div className="modal-body">
              <h6 className="mb-3">Price Range</h6>

              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label htmlFor="minPrice" className="form-label">
                    Minimum price
                  </label>

                  <div className="input-group">
                    <span className="input-group-text">₹</span>

                    <input
                      type="number"
                      id="minPrice"
                      className="form-control"
                      placeholder="Minimum"
                      min="0"
                      value={minPrice}
                      onChange={(event) => setMinPrice(event.target.value)}
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <label htmlFor="maxPrice" className="form-label">
                    Maximum price
                  </label>

                  <div className="input-group">
                    <span className="input-group-text">₹</span>

                    <input
                      type="number"
                      id="maxPrice"
                      className="form-control"
                      placeholder="Maximum"
                      min="0"
                      value={maxPrice}
                      onChange={(event) => setMaxPrice(event.target.value)}
                    />
                  </div>
                </div>
              </div>

              <hr />

              <h6 className="mb-3">Facilities</h6>

              <div className="row g-3 mb-4">
                {facilities.map((facility) => (
                  <div className="col-6 col-md-4" key={facility.name}>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`facility-${facility.name}`}
                        checked={selectedFacilities.includes(facility.name)}
                        onChange={() => handleFacilityChange(facility.name)}
                      />

                      <label
                        className="form-check-label"
                        htmlFor={`facility-${facility.name}`}
                      >
                        <i className={`bi bi-${facility.icon} me-2`} />
                        {facility.name}
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              <hr />

              <h6 className="mb-3">Sort By</h6>

              <select
                className="form-select"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
              >
                <option value="">Recommended</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="rating">Rating</option>
                <option value="newest">Newest</option>
              </select>
            </div>

            <div className="modal-footer d-flex justify-content-between">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handleClear}
              >
                Clear All
              </button>

              <button
                type="button"
                className="btn btn-color"
                data-bs-dismiss="modal"
                onClick={handleApply}
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
