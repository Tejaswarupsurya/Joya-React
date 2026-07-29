import { useQuery } from "@tanstack/react-query";
import { useOutletContext } from "react-router-dom";

import CategoryBar from "../components/listings/CategoryBar";
import ListingGrid from "../components/listings/ListingGrid";

import { getListings } from "../api/listings";
import type { CurrentUser } from "../types/user";

type MainLayoutContext = {
  currentUser: CurrentUser | null;
  userWishlist: string[];
};

export default function ListingsPage() {
  const { currentUser, userWishlist } = useOutletContext<MainLayoutContext>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["listings"],
    queryFn: getListings,
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Failed to load listings.</p>;
  }

  const listings = data?.data.listings ?? [];

  return (
    <>
      <CategoryBar />

      <ListingGrid
        listings={listings}
        currentUser={currentUser}
        userWishlist={userWishlist}
      />
    </>
  );
}
