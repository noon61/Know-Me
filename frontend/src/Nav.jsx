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
              to="/home"
              className={currentPath === "/home" ? "active" : ""}
              
            >
              Home
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
          <li className="nav-item nav-login">
            <Link
              to="/login"
              className={currentPath === "/login" ? "active" : ""}
              
            >
              ログイン
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default Nav
