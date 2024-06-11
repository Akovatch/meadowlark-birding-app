import React, { useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import Modal from "../UIElements/Modal";
import Button from "../FormElements/Button";
import LoadingSpinner from "../UIElements/LoadingSpinner";
import ErrorModal from "../UIElements/ErrorModal";
import { AuthContext } from "../../context/auth-context";
import { useHttpClient } from "../../hooks/http-hook";

import "./NavLinks.css";

export default function NavLinks(props) {
  const auth = useContext(AuthContext);
  const [showGuestModal, setShowGuestModal] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const navigate = useNavigate();

  async function confirmGuestLoginHandler() {
    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/users/signup",
        "POST",
        JSON.stringify({
          name: `guest-user--${Math.trunc(
            Math.random() * 100000000000000000000
          )}`,
          email: `${Math.trunc(
            Math.random() * 100000000000000000000
          )}@${Math.trunc(Math.random() * 100000000000000000000)}.com`,
          password: "GUEST-PASSWORD",
        }),
        {
          "Content-Type": "application/json",
        }
      );

      auth.login(responseData.userId, responseData.token);
      setShowGuestModal(false);
      props.closeDrawer();
      navigate("/locations");
    } catch (err) {}
  }

  function handleLogout() {
    auth.logout();
    navigate("/locations");
  }

  return (
    <>
      {isLoading && <LoadingSpinner asOverlay />}
      <ErrorModal error={error} onClear={clearError} />

      <Modal
        show={showGuestModal}
        onCancel={() => setShowGuestModal(false)}
        header="Guest Login"
        footer={
          <>
            <Button
              onClick={(event) => {
                event.stopPropagation();
                confirmGuestLoginHandler();
              }}
            >
              SIGN IN AS GUEST
            </Button>
            <Button inverse onClick={() => setShowGuestModal(false)}>
              CANCEL
            </Button>
          </>
        }
      >
        <h2> Welcome to Meadowlark!</h2>
        <p>
          As a guest, any bird sightings or locations you enter into the site
          will not be permanently saved, allowing you to explore all features of
          the site without modifying the database. Feel free to add, edit, and
          delete your sightings at will.
        </p>
        <p>
          If you do want your data to persist, consider logging in as a user.
        </p>
      </Modal>
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
            <NavLink to="/auth">USER LOGIN</NavLink>
          </li>
        )}
        {!auth.isLoggedIn && (
          <li>
            <button
              inverse
              onClick={(event) => {
                event.stopPropagation();
                setShowGuestModal(true);
              }}
            >
              GUEST LOGIN
            </button>
          </li>
        )}
        {auth.isLoggedIn && (
          <li>
            <button inverse onClick={handleLogout}>
              LOGOUT
            </button>
          </li>
        )}
      </ul>
    </>
  );
}
