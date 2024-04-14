import { type ReactElement } from "react";
import { useGetMyTours } from "../hooks/useGetMyTours";
import Loader from "./Loader";
import Card from "./Card";

function BookedTours(): ReactElement {
  const { isLoading, myTours } = useGetMyTours();

  if (isLoading) return <Loader />;
  return (
    <main className="main">
      <div className="card-container">
        {!!myTours &&
          myTours &&
          myTours?.data.data.map((tour) => <Card key={tour._id} tour={tour} />)}
      </div>
    </main>
  );
}

export default BookedTours;
