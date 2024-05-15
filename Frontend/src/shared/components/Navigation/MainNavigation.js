import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { GiHeron } from "react-icons/gi";
import { FaBinoculars } from "react-icons/fa";

import MainHeader from "./MainHeader";
import NavLinks from "./NavLinks";
import SideDrawer from "./SideDrawer";
import Backdrop from "../UIElements/Backdrop";

import "./MainNavigation.css";

export default function MainNavigation(props) {
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);

  const location = useLocation();

  function openDrawerHandler() {
    setDrawerIsOpen(true);
  }

  function closeDrawerHandler() {
    setDrawerIsOpen(false);
  }

  return (
    <>
      {drawerIsOpen && <Backdrop onClick={closeDrawerHandler} />}
      <SideDrawer show={drawerIsOpen} onClick={closeDrawerHandler}>
        <nav className="main-navigation__drawer-nav">
          <NavLinks />
        </nav>
      </SideDrawer>

      {location.pathname !== "/" && !location.pathname.endsWith("stats") && (
        <div className="banner"></div>
      )}

      <MainHeader>
        <button
          className="main-navigation__menu-btn"
          onClick={openDrawerHandler}
        >
          <span />
          <span />
          <span />
        </button>
        <div className="main-navigation-logo-container">
          <FaBinoculars color="white" size={50} style={{ margin: "5px" }} />
          <h1 className="main-navigation__title">
            <Link to="/">eadowlark</Link>
          </h1>
        </div>
        <nav className="main-navigation__header-nav">
          <NavLinks />
        </nav>
      </MainHeader>
    </>
  );
}
