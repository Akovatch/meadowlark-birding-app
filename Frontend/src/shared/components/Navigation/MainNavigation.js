import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBinoculars } from "react-icons/fa";

import MainHeader from "./MainHeader";
import NavLinks from "./NavLinks";
import SideDrawer from "./SideDrawer";
import Backdrop from "../UIElements/Backdrop";

import "./MainNavigation.css";

export default function MainNavigation() {
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
          <NavLinks closeDrawer={closeDrawerHandler} />
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
        <Link
          to="/"
          style={{
            textDecoration: "none",
          }}
        >
          <div className="main-navigation-logo-container">
            <FaBinoculars color="white" size={50} style={{ margin: "5px" }} />
            <h1 className="main-navigation__title">eadowlark</h1>
          </div>
        </Link>
        <nav className="main-navigation__header-nav">
          <NavLinks closeDrawer={closeDrawerHandler} />
        </nav>
      </MainHeader>
    </>
  );
}
