import { type ReactElement } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import MeTemplate from "../components/MeTemplate";
import { useAuthContext } from "../contexts/AuthContext";

function Me(): ReactElement {
  const { user } = useAuthContext();

  return (
    <>
      <Header />
      {user ? (
        <MeTemplate />
      ) : (
        <div
          style={{
            minHeight: "60dvh",
            display: "grid",
            placeItems: "center",
            fontSize: "40px",
            fontWeight: "bold",
          }}
        >
          <p>YOU ARE NOT ALLOWED TO SEE THIS PAGE LOGIN FIRST🤨</p>
        </div>
      )}
      <Footer />
    </>
  );
}

export default Me;
