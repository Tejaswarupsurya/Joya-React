import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useOutletContext, useSearchParams } from "react-router-dom";

import CategoryBar from "../components/listings/CategoryBar";
import ListingGrid from "../components/listings/ListingGrid";
import ListingSkeleton from "../components/listings/ListingSkeleton";

import { getListings } from "../api/listings";
import type { CurrentUser } from "../types/user";

type MainLayoutContext = {
  currentUser: CurrentUser | null;
  userWishlist: string[];
};

export default function ListingsPage() {
  const [includeTax, setIncludeTax] = useState(false);
  const { currentUser, userWishlist } = useOutletContext<MainLayoutContext>();

  const [searchParams, setSearchParams] = useSearchParams();

  const q = searchParams.get("q") ?? "";
  const selectedCategory = searchParams.get("category") ?? "all";
  const minPrice = searchParams.get("minPrice") ?? "";
  const maxPrice = searchParams.get("maxPrice") ?? "";
  const selectedFacilities = searchParams.getAll("facilities");
  const sortBy = searchParams.get("sortBy") ?? "";

  const { data, isLoading, isError } = useQuery({
    queryKey: [
      "listings",
      {
        q,
        category: selectedCategory,
        minPrice,
        maxPrice,
        facilities: selectedFacilities,
        sortBy,
      },
    ],

    queryFn: () =>
      getListings({
        q: q || undefined,
        category: selectedCategory === "all" ? undefined : selectedCategory,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
        facilities:
          selectedFacilities.length > 0 ? selectedFacilities : undefined,
        sortBy: sortBy || undefined,
      }),
  });

  const handleCategoryChange = (category: string) => {
    setSearchParams((params) => {
      const currentCategory = params.get("category");

      if (currentCategory === category) {
        params.delete("category");
      } else {
        params.set("category", category);
      }

      return params;
    });
  };

  if (isError) {
    return <p>Failed to load listings.</p>;
  }

  const listings = data?.data.listings ?? [];

  return (
    <>
      <CategoryBar
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        includeTax={includeTax}
        onTaxChange={setIncludeTax}
      />

      {isLoading ? (
        <ListingSkeleton />
      ) : (
        <ListingGrid
          listings={listings}
          currentUser={currentUser}
          userWishlist={userWishlist}
          includeTax={includeTax}
        />
      )}
    </>
  );
}
