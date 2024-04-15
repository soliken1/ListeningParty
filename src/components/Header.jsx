import React from "react";
import { Link } from "react-router-dom";
import DefaultIcon from "../assets/user.png";

function Header({ data, isHomePage, isNavActive, toggleNav, logout }) {
  return (
    <header>
      <div className="user-details mt-sm-5">
        {data && data.photoURL ? (
          <img className="user-pfp" src={data.photoURL} alt="User Profile" />
        ) : (
          <img className="user-pfp" src={DefaultIcon} alt="Custom Image" />
        )}
        <label className="font-primary white-color font-size-subheader ms-2">
          {data && data.displayName
            ? data.displayName
            : data && data.email && data.email.split("@")[0]}
        </label>
      </div>
      <div className="hamburger" onClick={toggleNav}>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>
      <nav className={`nav-bar ${isNavActive ? "active" : ""}`}>
        <ul>
          <li>
            <Link to="/Home" className={isHomePage ? "active" : ""}>
              Room List
            </Link>
          </li>
          <li>
            <a onClick={logout}>Logout</a>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
