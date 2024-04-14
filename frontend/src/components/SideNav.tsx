import { NavLink } from "react-router-dom";

function SideNav() {
  return (
    <ul className="side-nav">
      <li className="side-nav--active">
        <NavLink to="#">
          <svg>
            <use href="img/icons.svg#icon-settings"></use>
          </svg>
          Settings
        </NavLink>
      </li>
      <li>
        <NavLink to="/my-tours">
          <svg>
            <use href="img/icons.svg#icon-briefcase"></use>
          </svg>
          My bookings
        </NavLink>
      </li>
      <li>
        <NavLink to="#">
          <svg>
            <use href="img/icons.svg#icon-star"></use>
          </svg>
          My reviews
        </NavLink>
      </li>
      <li>
        <NavLink to="#">
          <svg>
            <use href="img/icons.svg#icon-credit-card"></use>
          </svg>
          Billing
        </NavLink>
      </li>
    </ul>
  );
}

export default SideNav;
