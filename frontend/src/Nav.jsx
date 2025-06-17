import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Nav.css'

const Nav = () => {
  const location = useLocation();
  const currentPath = location.pathname;

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
          <li className="nav-login nav-item ">
            <Link
              to="/login"
              className={currentPath === "/login" ? "active logout-button" : "logout-button"}
            >
              Log out
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default Nav