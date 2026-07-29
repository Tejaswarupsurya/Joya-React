import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useOutletContext, useSearchParams } from "react-router-dom";

import CategoryBar from "../components/listings/CategoryBar";
import ListingGrid from "../components/listings/ListingGrid";

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

  const { data, isLoading, isError } = useQuery({
    queryKey: ["listings", { q, category: selectedCategory }],
    queryFn: () =>
      getListings({
        q: q || undefined,
        category: selectedCategory === "all" ? undefined : selectedCategory,
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

  if (isLoading) {
    return <p>Loading...</p>;
  }

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

      <ListingGrid
        listings={listings}
        currentUser={currentUser}
        userWishlist={userWishlist}
        includeTax={includeTax}
      />
    </>
  );
}
