import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import "./ListingCard.css";

import type { Listing } from "../../types/listing";
import type { CurrentUser } from "../../types/user";
import type { AuthResponse } from "../../types/user";

import { toggleWishlist } from "../../api/wishlist";


type ListingCardProps = {
  listing: Listing;
  currentUser?: CurrentUser | null;
  userWishlist: string[];
  index: number;
  includeTax: boolean;
};

export default function ListingCard({
  listing,
  currentUser,
  userWishlist,
  index,
  includeTax,
}: ListingCardProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const displayedPrice = includeTax
    ? Math.round(listing.price * 1.18)
    : listing.price;

  // Derived from server state — no separate useState needed
  const isWishlisted = userWishlist.includes(listing._id);

  // UI-only state
  const [isClicked, setIsClicked] = useState(false);
  const [isHeartBeating, setIsHeartBeating] = useState(false);

  
  const wishlistMutation = useMutation({
    mutationFn: () => toggleWishlist(listing._id),

    onSuccess: (data) => {
      if (!data.success || !data.action) {
        toast.error(data.message || "Failed to update wishlist");
        return;
      }

      queryClient.setQueryData<AuthResponse>(["auth"], (oldData) => {
        if (!oldData) {
          return oldData;
        }

        if (data.action === "added") {
          return {
            ...oldData,
            userWishlist: [...oldData.userWishlist, listing._id],
          };
        }

        return {
          ...oldData,
          userWishlist: oldData.userWishlist.filter((id) => id !== listing._id),
        };
      });

      if (data.action === "added") {
        setIsHeartBeating(true);
        toast.success("Added to wishlist");

        window.setTimeout(() => {
          setIsHeartBeating(false);
        }, 600);
      } else {
        toast.success("Removed from wishlist");
      }
    },

    onError: (error) => {
      console.error("Error:", error);
      toast.error("Failed to update wishlist");
    },
  });

  const handleWishlist = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    setIsClicked(true);

    window.setTimeout(() => {
      setIsClicked(false);
    }, 400);

    wishlistMutation.mutate();
  };

  const handleGuestWishlist = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    setIsClicked(true);

    window.setTimeout(() => {
      navigate("/signup");
    }, 200);
  };

  return (
    <div
      className="card listing-card col"
      onClick={() => navigate(`/listings/${listing._id}`)}
    >
      <img
        src={listing.image.url.replace(
          "/upload/",
          "/upload/w_600,q_auto,f_auto/",
        )}
        className="card-img-top"
        alt={listing.image.filename}
        loading={index === 0 ? "eager" : "lazy"}
        width="300"
        height="200"
      />

      {currentUser && currentUser.role === "user" ? (
        <button
          className={`wishlist-btn ${
            isWishlisted ? "active" : ""
          } ${isClicked ? "clicked" : ""}`}
          data-listing-id={listing._id}
          onClick={handleWishlist}
          title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          disabled={wishlistMutation.isPending}
        >
          <i
            className="bi bi-heart-fill"
            style={{
              animation: isHeartBeating ? "heartBeat 0.6s ease-in-out" : "",
            }}
          />
        </button>
      ) : !currentUser ? (
        <button
          className={`wishlist-btn ${isClicked ? "clicked" : ""}`}
          data-listing-id={listing._id}
          onClick={handleGuestWishlist}
          title="Sign up to save favorites"
        >
          <i className="bi bi-heart-fill" />
        </button>
      ) : null}

      <div className="card-img-overlay"></div>

      <div className="card-body">
        <div className="d-flex align-items-center justify-content-between">
          <p className="card-text mt-1 mb-1">
            <b>{listing.title}</b>
          </p>

          <p className="card-text mt-1 mb-1 me-3 small text-muted">
            <i className="bi bi-star-fill text-warning"></i>{" "}
            {listing.avgRating?.toFixed(1) || "N/A"}
          </p>
        </div>

        <div className="d-flex align-items-center justify-content-between">
          <p
            className="card-text listing-price mt-1 mb-0"
            data-original-price={listing.price}
          >
            ₹{displayedPrice.toLocaleString("en-IN")}/night
            {includeTax ? " (incl. taxes)" : ""}
          </p>

          <div className="card-text mb-0">
            {!currentUser ? (
              <Link
                to="/signup"
                className="btn btn-color btn-sm rounded-pill px-3 py-1 book-now-btn"
                onClick={(event) => event.stopPropagation()}
              >
                Book Now
              </Link>
            ) : currentUser.role === "user" || currentUser.role === "admin" ? (
              <Link
                to={`/listings/${listing._id}/bookings/new`}
                className="btn btn-color btn-sm rounded-pill px-3 py-1 book-now-btn"
                onClick={(event) => event.stopPropagation()}
              >
                Book Now
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
