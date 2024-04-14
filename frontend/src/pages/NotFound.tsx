import { type ReactElement } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

function NotFound(): ReactElement {
  return (
    <>
      <Header />
      <main className="main" style={{minHeight: "60dvh"}}>
        <div className="error">
          <div className="error__title">
            <h2 className="heading-secondary heading-secondary--error">
              Uh oh! Something went wrong!
            </h2>
            <h2 className="error__emoji">😢 🤯</h2>
            <div className="error__msg">Page not found!</div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default NotFound;
