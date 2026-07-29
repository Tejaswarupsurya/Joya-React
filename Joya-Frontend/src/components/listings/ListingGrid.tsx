import ListingCard from "./ListingCard";
import NoResults from "./NoResults";
import type { Listing } from "../../types/listing";
import type { CurrentUser } from "../../types/user";

type ListingGridProps = {
  listings: Listing[];
  currentUser?: CurrentUser | null;
  userWishlist: string[];
  includeTax: boolean;
};

export default function ListingGrid({
  listings,
  currentUser,
  userWishlist,
  includeTax,
}: ListingGridProps) {
  if (listings.length === 0) {
    return <NoResults />;
  }
  return (
    <div
      id="listings-container"
      className="row row-cols-lg-4 row-cols-md-2 row-cols-sm-1 g-4"
    >
      {listings.map((listing, index) => (
        <ListingCard
          key={listing._id}
          listing={listing}
          currentUser={currentUser}
          userWishlist={userWishlist}
          index={index}
          includeTax={includeTax}
        />
      ))}
    </div>
  );
}
