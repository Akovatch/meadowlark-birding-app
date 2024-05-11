import React, { useState } from "react";
import MapFilter from "../../../filters/MapFilter";

import { FcExpand } from "react-icons/fc";

import "./FilterPanel.css";

export default function FilterPanel({ children }) {
  const [panelOpen, setPanelOpen] = useState(false);
  const [windowWide, setWindowWide] = useState(window.innerWidth > 768);

  function handleResize() {
    if (windowWide && window.innerWidth <= 768) {
      setWindowWide(false);
    } else if (!windowWide && window.innerWidth > 768) {
      setWindowWide(true);
    }
  }

  window.addEventListener("resize", handleResize);

  function getMapFilterByScreenWidth() {
    if (windowWide) {
      return (
        <MapFilter
          includeCloseButton={false}
          closePanel={() => setPanelOpen(false)}
        />
      );
    } else if (panelOpen) {
      return (
        <MapFilter
          includeCloseButton={true}
          closePanel={() => setPanelOpen(false)}
        />
      );
    } else {
      return (
        <div className="filter-open-button-row">
          <button onClick={() => setPanelOpen(true)}>
            Filters <FcExpand />
          </button>
        </div>
      );
    }
  }

  // let location = useLocation();

  // if (location.pathname.includes("locations/") && !windowWide) {
  //   return children;
  // }

  return (
    <div className="split-panels-container">
      <div className="filter-panel">{getMapFilterByScreenWidth()}</div>
      <div className="content-panel">{children}</div>
    </div>
  );
}
