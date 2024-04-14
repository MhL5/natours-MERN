import { type ReactElement } from "react";

function Footer(): ReactElement {
  return (
    <footer className="footer">
      <div className="footer__logo">
        <img src="/img/logo-green.png" alt="Natours logo" />
      </div>

      <ul className="footer_nav">
        <li>
          <a href="#">About us</a>
        </li>
        <li>
          <a href="#">Download apps</a>
        </li>
        <li>
          <a href="#">become a guide</a>
        </li>
        <li>
          <a href="#">Careers</a>
        </li>
      </ul>

      <p className="footer__copyright">
        &copy; by Jonas Schmedtmann. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;
