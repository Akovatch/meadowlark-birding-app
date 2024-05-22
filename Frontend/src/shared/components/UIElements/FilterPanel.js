import React, { useState } from "react";
import { FcExpand } from "react-icons/fc";
import { CSSTransition } from "react-transition-group";

import MapFilter from "../../../filters/MapFilter";

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

  return (
    <div className="split-panels-container">
      <div
        className={
          windowWide || (panelOpen && !windowWide)
            ? "filter-panel"
            : "filter-panel closed"
        }
      >
        <MapFilter
          panelOpen={panelOpen}
          setPanelOpen={setPanelOpen}
          windowWide={windowWide}
        />
      </div>
      <div className="content-panel">{children}</div>
    </div>
  );
}
