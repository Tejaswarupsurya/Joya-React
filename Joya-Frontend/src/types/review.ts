export type ReviewAuthor = {
  _id: string;
  username: string;
};

export type Review = {
  _id: string;
  rating: number;
  comment: string;
  author: ReviewAuthor;
  createdAt: string;
};

export type StarBreakdown = {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
};

export type CreateReviewPayload = {
  rating: number;
  comment: string;
};

export type ReviewResponse = {
  success: boolean;
  message: string;
  review?: Review;
};
