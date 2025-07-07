import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Nav.css';

const Nav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <div className="nav-fixed">
      <nav>
        <ul className="nav-list">
          <li className="nav-item">
            <Link
              to="/profile"
              className={currentPath === "/profile" || currentPath === "/" ? "active" : ""}
            >
              Profile
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/search"
              className={currentPath === "/search" ? "active" : ""}
            >
              Search
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/message"
              className={currentPath === "/message" ? "active" : ""}
            >
              Message
            </Link>
          </li>
          <li className="nav-login nav-item">
            <Link
              to={isLoggedIn ? "#" : "/login"}
              className={currentPath === "/login" ? "active logout-button" : "logout-button"}
              onClick={(e) => {
                if (isLoggedIn) {
                  e.preventDefault(); // "#" への遷移を防止
                  localStorage.removeItem('token');
                  navigate('/login'); // ログアウト後にログインページへ遷移
                }
              }}
            >
              {isLoggedIn ? "Log out" : "Log in"}
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Nav;
