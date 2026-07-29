export type Listing = {
  _id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  country: string;
  category: string;

  image: {
    url: string;
    filename: string;
  };

  avgRating?: number;
};
