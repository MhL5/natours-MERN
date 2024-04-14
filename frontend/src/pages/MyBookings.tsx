import { type ReactElement } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BookedTours from "../components/BookedTours";

function MyBookings(): ReactElement {
  return (
    <>
      <Header />
      <BookedTours />
      <Footer />
    </>
  );
}

export default MyBookings;
