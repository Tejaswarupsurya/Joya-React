import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

import { getEditListing, updateListing } from "../api/listings";
import { categories } from "../constants/categories";
import { facilities as facilitiesList } from "../constants/facilities";
import EditListingSkeleton from "../components/listings/EditListingSkeleton";
import type { Listing } from "../types/listing";

type EditListingFormProps = {
  listing: Listing;
  originalImageUrl?: string;
};

function EditListingForm({ listing, originalImageUrl }: EditListingFormProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState<string>(listing.title || "");
  const [description, setDescription] = useState<string>(listing.description || "");
  const [price, setPrice] = useState<number | "">(listing.price ?? "");
  const [country, setCountry] = useState<string>(listing.country || "");
  const [location, setLocation] = useState<string>(listing.location || "");
  const [category, setCategory] = useState<string>(
    listing.category || categories[0]?.name || ""
  );
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>(
    listing.facilities || []
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [validated, setValidated] = useState<boolean>(false);

  const updateMutation = useMutation({
    mutationFn: (formData: FormData) => updateListing(listing._id, formData),
    onSuccess: (data) => {
      toast.success(data.message || "Updated Successfully!");
      queryClient.invalidateQueries({ queryKey: ["listingDetail", listing._id] });
      queryClient.invalidateQueries({ queryKey: ["editListing", listing._id] });
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      navigate(`/listings/${listing._id}`);
    },
    onError: (err) => {
      if (err instanceof AxiosError && err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Failed to update listing. Please try again.");
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
    if (!form.checkValidity()) {
      toast.error("Please fill in all required fields correctly.");
      return;
    }

    const formData = new FormData();
    formData.append("listing[title]", title);
    formData.append("listing[description]", description);
    formData.append("listing[price]", String(price));
    formData.append("listing[country]", country);
    formData.append("listing[location]", location);
    formData.append("listing[category]", category);

    selectedFacilities.forEach((fac) => {
      formData.append("listing[facilities]", fac);
    });

    if (imageFile) {
      formData.append("listing[image]", imageFile);
    }

    updateMutation.mutate(formData);
  };

  return (
    <div className="container row mt-3 mx-auto">
      <div className="col-12 col-md-8 offset-md-2">
        <h3 className="mb-3">Edit Your Details</h3>
        <form
          method="POST"
          noValidate
          className={`needs-validation ${validated ? "was-validated" : ""}`}
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          {/* Title */}
          <div className="mb-3">
            <label htmlFor="title" className="form-label fw-bold">
              Title
            </label>
            <input
              id="title"
              name="listing[title]"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              required
            />
            <div className="valid-feedback">Great!</div>
            <div className="invalid-feedback">Title is required.</div>
          </div>

          {/* Description */}
          <div className="mb-3">
            <label htmlFor="description" className="form-label fw-bold">
              Description
            </label>
            <textarea
              id="description"
              name="listing[description]"
              className="form-control"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <div className="invalid-feedback">Enter a short Description</div>
          </div>

          {/* Original Image Preview */}
          {originalImageUrl && (
            <div className="mb-3">
              <label className="form-label fw-bold">Original Image</label>
              <br />
              <img
                src={originalImageUrl}
                alt="Original listing"
                className="img-thumbnail rounded"
                style={{ maxHeight: "200px", objectFit: "cover" }}
              />
            </div>
          )}

          {/* Upload New Image */}
          <div className="mb-3">
            <label htmlFor="image" className="form-label fw-bold">
              Upload New Image
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
                }
              }}
            />
          </div>

          {/* Select Category */}
          <div className="mb-3">
            <label htmlFor="category" className="form-label fw-bold">
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
            <label className="form-label fw-bold">Facilities</label>
            <div className="row g-2">
              {facilitiesList.map((facItem) => {
                const facilityName = facItem.name;
                const facId = `facility-${facilityName.replace(/\s+/g, "-")}`;
                const isChecked = selectedFacilities.includes(facilityName);
                return (
                  <div key={facilityName} className="col-6 col-sm-4 col-md-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={facId}
                        checked={isChecked}
                        onChange={() => handleFacilityChange(facilityName)}
                      />
                      <label
                        className="form-check-label user-select-none"
                        role="button"
                        htmlFor={facId}
                      >
                        {facilityName}
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Price & Country */}
          <div className="row">
            <div className="mb-3 col-md-4">
              <label htmlFor="price" className="form-label fw-bold">
                Price
              </label>
              <input
                id="price"
                name="listing[price]"
                className="form-control"
                value={price}
                onChange={(e) =>
                  setPrice(e.target.value ? Number(e.target.value) : "")
                }
                type="number"
                min={0}
                required
              />
              <div className="invalid-feedback">Price should be valid!</div>
            </div>
            <div className="mb-3 col-md-8">
              <label htmlFor="country" className="form-label fw-bold">
                Country
              </label>
              <input
                id="country"
                name="listing[country]"
                className="form-control"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                type="text"
                required
              />
              <div className="invalid-feedback">Country should be valid!</div>
            </div>
          </div>

          {/* Location */}
          <div className="mb-3">
            <label htmlFor="location" className="form-label fw-bold">
              Location
            </label>
            <input
              id="location"
              name="listing[location]"
              className="form-control"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              type="text"
              required
            />
            <small className="mt-1 text-warning d-block">
              <i className="bi bi-exclamation-triangle-fill me-1" />
              Note: Enter a valid Location in{" "}
              <span style={{ textDecoration: "underline" }}>
                Location, State
              </span>{" "}
              Format Only!
            </small>
            <div className="invalid-feedback">Location should be valid!</div>
          </div>

          {/* Actions */}
          <div className="d-flex justify-content-between align-items-center mt-4 mb-5">
            <button
              type="submit"
              className="btn btn-color px-4 py-2"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? "Updating..." : "Edit Now"}
            </button>
            <Link to={`/listings/${listing._id}`} className="text-muted go-back">
              <i className="bi bi-caret-left-fill me-1" />
              Go Back
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function EditListingPage() {
  const { id } = useParams<{ id: string }>();

  const editQuery = useQuery({
    queryKey: ["editListing", id],
    queryFn: () => getEditListing(id!),
    enabled: Boolean(id),
  });

  if (editQuery.isLoading) {
    return <EditListingSkeleton />;
  }

  if (editQuery.isError || !editQuery.data?.listing) {
    return (
      <div className="container mt-5 text-center py-5">
        <div className="alert alert-danger">
          {editQuery.error instanceof AxiosError &&
          editQuery.error.response?.data?.message
            ? editQuery.error.response.data.message
            : "The Listing you requested for does not exist!"}
        </div>
        <Link to="/listings" className="btn btn-color mt-3">
          Back to Listings
        </Link>
      </div>
    );
  }

  const { listing, originalImageUrl } = editQuery.data;

  return (
    <EditListingForm
      key={listing._id}
      listing={listing}
      originalImageUrl={originalImageUrl}
    />
  );
}
