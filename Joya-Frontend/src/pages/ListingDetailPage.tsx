import { Link, useNavigate, useParams, useOutletContext } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

import { getListingById, deleteListing } from "../api/listings";
import type { CurrentUser } from "../types/user";
import ListingMap from "../components/listings/ListingMap";
import ListingDetailSkeleton from "../components/listings/ListingDetailSkeleton";
import ReviewForm from "../components/reviews/ReviewForm";
import ReviewSummary from "../components/reviews/ReviewSummary";
import ReviewCard from "../components/reviews/ReviewCard";
import { getAvgRating, getStarBreakdown } from "../utils/review";
import { categories } from "../constants/categories";
import { facilities } from "../constants/facilities";
import "./ListingDetailPage.css";

const getCategoryIcon = (categoryName: string) => {
  const match = categories.find(
    (c) => c.name.toLowerCase() === categoryName.toLowerCase()
  );
  return match?.icon || "tag";
};

const getFacilityIcon = (facilityName: string) => {
  const match = facilities.find(
    (f) => f.name.toLowerCase() === facilityName.toLowerCase()
  );
  return match?.icon || "shield-fill-check";
};

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const outletContext = useOutletContext<{ currentUser?: CurrentUser | null }>();
  const currentUser = outletContext?.currentUser;

  // Query listing details
  const listingQuery = useQuery({
    queryKey: ["listing", id],
    queryFn: () => getListingById(id!),
    enabled: Boolean(id),
  });

  // Mutation to delete listing
  const deleteListingMutation = useMutation({
    mutationFn: () => deleteListing(id!),
    onSuccess: (data) => {
      toast.success(data.message || "Deleted Successfully!");
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      navigate("/listings");
    },
    onError: (err) => {
      if (err instanceof AxiosError && err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Failed to delete listing.");
      }
    },
  });

  const handleDeleteListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to delete this listing?")) {
      deleteListingMutation.mutate();
    }
  };

  if (listingQuery.isLoading) {
    return <ListingDetailSkeleton />;
  }

  if (listingQuery.isError || !listingQuery.data?.listing) {
    return (
      <div className="container text-center mt-5 py-5">
        <div className="alert alert-danger">
          {listingQuery.error instanceof AxiosError &&
          listingQuery.error.response?.data?.message
            ? listingQuery.error.response.data.message
            : "The Listing you requested for doesn't exist!"}
        </div>
        <Link to="/listings" className="btn btn-color mt-3">
          Back to Listings
        </Link>
      </div>
    );
  }

  const { listing } = listingQuery.data;
  const avgRating = getAvgRating(listing.reviews);
  const starBreakdown = getStarBreakdown(listing.reviews);

  const isOwnerOrAdmin =
    currentUser &&
    listing.owner &&
    (listing.owner._id === currentUser._id || currentUser.role === "admin");

  const totalReviews = listing.reviews?.length || 0;
  const categoryIcon = getCategoryIcon(listing.category);

  return (
    <div className="container mt-3">
      <div className="row">
        <div className="col-12 col-md-8 offset-md-2">
          <h3 className="mb-3">{listing.title}</h3>
          <div className="card listing-card show-card">
            <img
              src={listing.image?.url}
              className="card-img-top show-img"
              alt={listing.image?.filename || listing.title}
              loading="lazy"
            />
            <div className="card-body">
              <p className="card-text text-muted mt-1">
                Owned by: <i> {listing.owner?.username || "Host"} </i>
              </p>
              <p className="card-text">{listing.description}</p>
              <p className="card-text">
                <b>&#8377;{listing.price?.toLocaleString("en-IN")}/night.</b>
              </p>
              <p className="card-text mb-3">
                <i
                  className={`fa-solid ${
                    categoryIcon.startsWith("fa-")
                      ? categoryIcon
                      : `fa-${categoryIcon}`
                  } me-1 text-muted`}
                />
                {listing.category}
              </p>
              <p className="card-text mb-3">
                <i className="bi bi-geo-alt-fill me-1" />
                {listing.location}
              </p>
              <p className="card-text mb-0">
                <i className="bi bi-globe-americas me-1" />
                {listing.country}
              </p>
            </div>

            {/* Facilities */}
            {listing.facilities && listing.facilities.length > 0 && (
              <div className="card-body pt-0">
                <hr />
                <h5>Facilities</h5>
                <div className="row">
                  {listing.facilities.map((facility) => {
                    const iconName = getFacilityIcon(facility);


                    return (
                      <div key={facility} className="col-6 d-flex align-items-center gap-2 mb-2">
                        <i className={`bi ${iconName} fs-5 text-muted`} />
                        <span>{facility}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Book & Owner Buttons */}
            <div className="card-body pt-0">
              {!currentUser ? (
                <Link
                  to="/signup"
                  className="btn btn-color btn-sm rounded-pill book-this-stay px-3 py-2 mt-3"
                >
                  Book This Stay
                </Link>
              ) : (
                currentUser.role === "user" && (
                  <Link
                    to={`/listings/${listing._id}/bookings/new`}
                    className="btn btn-color btn-sm rounded-pill book-this-stay px-3 py-2 mt-3"
                  >
                    Book This Stay
                  </Link>
                )
              )}

              {isOwnerOrAdmin && (
                <div className="btns mt-3 mb-0 d-flex flex-column flex-md-row justify-content-end gap-3">
                  <Link
                    to={`/listings/${listing._id}/edit`}
                    className="btn btn-color"
                    style={{ width: "100px" }}
                  >
                    Edit
                  </Link>
                  <form onSubmit={handleDeleteListing}>
                    <button
                      type="submit"
                      className="btn btn-dark"
                      style={{ width: "100px" }}
                      disabled={deleteListingMutation.isPending}
                    >
                      {deleteListingMutation.isPending ? "Deleting..." : "Delete"}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>

          <div className="col-12">
            {/* Write a Review Form */}
            {id && <ReviewForm listingId={id} currentUser={currentUser} />}

            {/* Review Summary */}
            <ReviewSummary
              avgRating={avgRating}
              totalReviews={totalReviews}
              starBreakdown={starBreakdown}
            />

            {/* All Reviews */}
            {totalReviews > 0 && (
              <div className="row">
                <h4 className="mb-3">All Reviews</h4>
                {listing.reviews?.map((review) => (
                  <ReviewCard
                    key={review._id}
                    listingId={id!}
                    listingOwnerId={listing.owner?._id}
                    review={review}
                    currentUser={currentUser}
                  />
                ))}
              </div>
            )}

            {/* Map Section */}
            <div className="col-12">
              <hr />
              <h3 className="mb-2">
                <i className="bi bi-globe-americas me-1" />
                Where you'll be
              </h3>
              <ListingMap
                coordinates={listing.geometry?.coordinates}
                title={listing.title}
                location={listing.location}
                country={listing.country}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
