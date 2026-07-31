import type { Review, StarBreakdown } from "../types/review";

export const getAvgRating = (reviews?: Review[]): number => {
  if (!reviews || reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
  return sum / reviews.length;
};

export const getStarBreakdown = (reviews?: Review[]): StarBreakdown => {
  const breakdown: StarBreakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  if (!reviews) return breakdown;

  reviews.forEach((r) => {
    const star = Math.round(r.rating) as 1 | 2 | 3 | 4 | 5;
    if (breakdown[star] !== undefined) {
      breakdown[star]++;
    }
  });

  return breakdown;
};
