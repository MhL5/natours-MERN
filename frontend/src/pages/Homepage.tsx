import { type ReactElement } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Overview from "../components/Overview";

function Homepage(): ReactElement {
  return (
    <>
      <Header />
      <Overview />
      <Footer />
    </>
  );
}

export default Homepage;
