import { NavLink } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";

function SideAdminNav() {
  const { user } = useAuthContext();
  if (user?.role !== "admin") return null;
  return (
    <ul className="side-nav">
      <li>
        <NavLink to="#">
          <svg>
            <use href="img/icons.svg#icon-map"></use>
          </svg>
          Manage tours
        </NavLink>
      </li>
      <li>
        <NavLink to="#">
          <svg>
            <use href="img/icons.svg#icon-users"></use>
          </svg>
          Manage users
        </NavLink>
      </li>
      <li>
        <NavLink to="#">
          <svg>
            <use href="img/icons.svg#icon-star"></use>
          </svg>
          Manage reviews
        </NavLink>
      </li>
      <li>
        <NavLink to="#">
          <svg>
            <use href="img/icons.svg#icon-briefcase"></use>
          </svg>
        </NavLink>
      </li>
    </ul>
  );
}

export default SideAdminNav;
