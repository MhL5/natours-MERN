import { type ReactElement } from "react";
import Card from "./Card";
import { TourData } from "../pages/TourOverview";
import Loader from "./Loader";
import { useGetTours } from "../hooks/useGetTours";

export type TourResponse = {
  status: string;
  data: {
    data: TourData[];
  };
};

function Overview(): ReactElement {
  const { isLoading, tours } = useGetTours();

  if (isLoading) return <Loader />;
  return (
    <main className="main">
      <div className="card-container">
        {!!tours &&
          tours &&
          tours?.data.data.map((tour) => <Card key={tour._id} tour={tour} />)}
      </div>
    </main>
  );
}

export default Overview;
