import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

import { createListing } from "../api/listings";
import { categories } from "../constants/categories";
import { facilities as facilitiesList } from "../constants/facilities";

export default function NewListingPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [category, setCategory] = useState<string>(categories[0]?.name || "Hotel");
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [price, setPrice] = useState<number | "">("");
  const [country, setCountry] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [termsAgreement, setTermsAgreement] = useState<boolean>(false);
  const [safetyGuidelines, setSafetyGuidelines] = useState<boolean>(false);
  const [validated, setValidated] = useState<boolean>(false);

  const createMutation = useMutation({
    mutationFn: (formData: FormData) => createListing(formData),
    onSuccess: (data) => {
      toast.success(data.message || "New Hotel Added!");
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      navigate("/listings");
    },
    onError: (err) => {
      if (err instanceof AxiosError && err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Failed to create listing. Please try again.");
      }
    },
  });

  const handleFacilityChange = (facilityName: string) => {
    setSelectedFacilities((prev) =>
      prev.includes(facilityName)
        ? prev.filter((item) => item !== facilityName)
        : [...prev, facilityName]
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidated(true);

    const form = e.currentTarget;
    if (!form.checkValidity() || !imageFile || !termsAgreement || !safetyGuidelines) {
      toast.error("Please fill in all required fields correctly.");
      return;
    }

    const formData = new FormData();
    formData.append("listing[title]", title);
    formData.append("listing[description]", description);
    formData.append("listing[image]", imageFile);
    formData.append("listing[category]", category);
    formData.append("listing[price]", String(price));
    formData.append("listing[country]", country);
    formData.append("listing[location]", location);

    selectedFacilities.forEach((fac) => {
      formData.append("listing[facilities]", fac);
    });

    createMutation.mutate(formData);
  };

  return (
    <div className="container row mt-3 mx-auto">
      <div className="col-12 col-md-8 offset-md-2">
        <h3 className="mb-3">Fill Details</h3>
        <form
          method="POST"
          noValidate
          className={`needs-validation ${validated ? "was-validated" : ""}`}
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          {/* Title */}
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              id="title"
              name="listing[title]"
              className="form-control"
              placeholder="Enter Title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <div className="valid-feedback">Great!</div>
          </div>

          {/* Description */}
          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              name="listing[description]"
              className="form-control"
              placeholder="Enter Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <div className="invalid-feedback">Enter a short Description</div>
          </div>

          {/* Upload Image */}
          <div className="mb-3">
            <label htmlFor="image" className="form-label">
              Upload Image
            </label>
            <input
              id="image"
              name="listing[image]"
              className="form-control"
              type="file"
              accept="image/jpeg,image/png,image/jpg"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setImageFile(e.target.files[0]);
                } else {
                  setImageFile(null);
                }
              }}
              required
            />
            <div className="invalid-feedback">Image is Required!</div>
          </div>

          {/* Select Category */}
          <div className="mb-3">
            <label htmlFor="category" className="form-label">
              Select a Category
            </label>
            <select
              id="category"
              name="listing[category]"
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              {categories.map((cat) => (
                <option key={cat.name} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Facilities */}
          <div className="mb-3">
            <label htmlFor="facilities" className="form-label fw-bold">
              Facilities
            </label>
            {facilitiesList.map((facItem) => {
              const facilityName = facItem.name;
              const facId = `facility-${facilityName.replace(/\s+/g, "-")}`;
              const isChecked = selectedFacilities.includes(facilityName);
              return (
                <div key={facilityName} className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="listing[facilities]"
                    value={facilityName}
                    id={facId}
                    checked={isChecked}
                    onChange={() => handleFacilityChange(facilityName)}
                  />
                  <label
                    className="form-check-label"
                    role="button"
                    htmlFor={facId}
                  >
                    {facilityName}
                  </label>
                </div>
              );
            })}
          </div>

          {/* Price & Country */}
          <div className="row">
            <div className="mb-3 col-md-4">
              <label htmlFor="price" className="form-label">
                Price
              </label>
              <input
                id="price"
                name="listing[price]"
                className="form-control"
                placeholder="Enter Price"
                type="number"
                min={0}
                value={price}
                onChange={(e) =>
                  setPrice(e.target.value ? Number(e.target.value) : "")
                }
                required
              />
              <div className="invalid-feedback">Price should be valid!</div>
            </div>
            <div className="mb-3 col-md-8">
              <label htmlFor="country" className="form-label">
                Country
              </label>
              <input
                id="country"
                name="listing[country]"
                className="form-control"
                placeholder="Enter Country"
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              />
              <div className="invalid-feedback">Country should be valid!</div>
            </div>
          </div>

          {/* Location */}
          <div className="mb-3">
            <label htmlFor="location" className="form-label">
              Location
            </label>
            <input
              id="location"
              name="listing[location]"
              className="form-control"
              placeholder="Enter Location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
            <div className="invalid-feedback">Location should be valid!</div>
            <small className="mt-1 text-warning d-block">
              <i className="bi bi-exclamation-triangle-fill me-1" />
              Note: Enter a valid Location in{" "}
              <span style={{ textDecoration: "underline", fontSize: "medium" }}>
                Location, State
              </span>{" "}
              Format Only!
            </small>
          </div>

          {/* Terms and Safety Agreement */}
          <div className="card bg-light border-0 mb-3">
            <div className="card-body">
              <h6 className="card-title text-dark">
                <i className="bi bi-shield-check me-2" />
                Agreement & Guidelines
              </h6>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="termsAgreement"
                  checked={termsAgreement}
                  onChange={(e) => setTermsAgreement(e.target.checked)}
                  required
                />
                <label className="form-check-label" htmlFor="termsAgreement">
                  I agree to Joya's{" "}
                  <Link to="/info/terms" target="_blank" className="text-primary">
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link to="/info/privacy" target="_blank" className="text-primary">
                    Privacy Policy
                  </Link>
                </label>
                <div className="invalid-feedback">
                  Please agree to our terms and privacy policy
                </div>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="safetyGuidelines"
                  checked={safetyGuidelines}
                  onChange={(e) => setSafetyGuidelines(e.target.checked)}
                  required
                />
                <label className="form-check-label" htmlFor="safetyGuidelines">
                  I have read and understand the{" "}
                  <Link to="/info/safety" target="_blank" className="text-primary">
                    Safety Guidelines
                  </Link>{" "}
                  and{" "}
                  <Link to="/info/community" target="_blank" className="text-primary">
                    Community Standards
                  </Link>
                </label>
                <div className="invalid-feedback">
                  Please acknowledge our safety and community guidelines
                </div>
              </div>
              <small className="text-muted d-block mt-2">
                <i className="bi bi-info-circle me-1" />
                Need help? Check our{" "}
                <Link to="/info/host-guide" target="_blank" className="text-primary">
                  Host Guide
                </Link>{" "}
                or{" "}
                <Link to="/info/help-center" target="_blank" className="text-primary">
                  Help Center
                </Link>
              </small>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-5">
            <button
              type="submit"
              className="btn btn-color"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? "Adding..." : "Add Now"}
            </button>
            <Link to="/listings" className="text-muted go-back">
              <i className="bi bi-caret-left-fill me-1" />
              Go Back
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
