import React, { useContext } from "react";
import { NavLink } from "react-router-dom";

import { AuthContext } from "../../context/auth-context";

import "./NavLinks.css";

export default function NavLinks(props) {
  const auth = useContext(AuthContext);

  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/locations" exact>
          COMMUNITY SIGHTINGS
        </NavLink>
      </li>
      {auth.isLoggedIn && (
        <li>
          <NavLink to={`/${auth.userId}/locations`}>MY SIGHTINGS</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to="/location/new">ADD LOCATION</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to={`/${auth.userId}/stats`}>MY STATS</NavLink>
        </li>
      )}
      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/auth">SIGN IN</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <button inverse onClick={auth.logout}>
            LOGOUT
          </button>
        </li>
      )}
    </ul>
  );
}
