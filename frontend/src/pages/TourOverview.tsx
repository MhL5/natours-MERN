import { type ReactElement } from "react";
import Tour from "../components/Tour";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import { useGetTour } from "../hooks/useGetTour";

type LocationPoint = {
  type: string;
  coordinates: [number, number];
  description: string;
  day?: number;
  _id: string;
  id?: string;
  address?: string;
};

type Guide = {
  _id: string;
  name: string;
  email: string;
  photo: string;
  role: string;
};

export type Review = {
  _id: string;
  review: string;
  rating: number;
  createdAt: string;
  tour: string;
  user: {
    _id: string;
    name: string;
    photo: string;
  };
  __v: number;
  id: string;
};

export type TourData = {
  startLocation: LocationPoint;
  _id: string;
  name: string;
  duration: number;
  maxGroupSize: number;
  difficulty: string;
  ratingsAverage: number;
  ratingsQuantity: number;
  price: number;
  summary: string;
  description: string;
  imageCover: string;
  images: string[];
  startDates: string[];
  secretTour: boolean;
  locations: LocationPoint[];
  guides: Guide[];
  slug: string;
  __v: number;
  durationWeek: number;
  reviews: Review[];
  id: string;
};

export type TourResponse = {
  status: string;
  data: {
    data: TourData;
  };
};

function TourOverview(): ReactElement {
  const { tourId } = useParams();

  const { tour, error, isLoading } = useGetTour({
    tourId: tourId || "notfound",
  });

  return (
    <>
      <Header />
      {error && <p>something went wrong</p>}
      {isLoading ? <Loader /> : <Tour tour={tour?.data.data} />}
      <Footer />
    </>
  );
}

export default TourOverview;
