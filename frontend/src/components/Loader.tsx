import { type ReactElement } from "react";

function Loader(): ReactElement {
  return (
    <div className="loader">
      <div className="loader__text">LOADING...⌛</div>
    </div>
  );
}

export default Loader;
