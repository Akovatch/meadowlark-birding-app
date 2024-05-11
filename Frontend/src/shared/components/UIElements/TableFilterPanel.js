import React, { useState } from "react";
import MapFilter from "../../../filters/MapFilter";

import { FcExpand } from "react-icons/fc";

import "./TableFilterPanel.css";

export default function TableFilterPanel({ children }) {
  const [panelOpen, setPanelOpen] = useState(false);

  if (panelOpen) {
    return (
      <div className="filter-panel">
        <MapFilter
          includeCloseButton={true}
          closePanel={() => setPanelOpen(false)}
        />
      </div>
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
