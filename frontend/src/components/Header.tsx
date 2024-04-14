import { type ReactElement } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import { useLogout } from "../hooks/useLogout";
import Loader from "./Loader";

function Header(): ReactElement {
  const { setUserFn, user } = useAuthContext();

  const { isPending, logoutFn } = useLogout();

  function handleLogout() {
    logoutFn();
    setUserFn(null);
  }

  if (isPending) return <Loader />;
  return (
    <header className="header">
      <nav className="nav nav--tours">
        <Link to="/" className="nav__el">
          All tours
        </Link>
      </nav>

      <div className="header__logo">
        <img src="/img/logo-white.png" alt="Natours logo" />
      </div>

      <nav className="nav nav--user">
        {user ? (
          <>
            <button
              onClick={handleLogout}
              type="button"
              className="nav__el nav__el--logout"
            >
              logout
            </button>
            <Link to="/me">
              <img
                className="nav__user-img"
                src={`/img/users/${user.photo}`}
                alt=""
              />
              <span>
                <h1>{user.name.split(" ")[0]}</h1>
              </span>
            </Link>
          </>
        ) : (
          <>
            <Link to="/login" className="nav__el">
              login
            </Link>
            <Link to="/login" className="nav__el nav__el--cta">
              sign up
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
