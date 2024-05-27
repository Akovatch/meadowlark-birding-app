import React from "react";
import ReactDOM from "react-dom";
import { FaBinoculars } from "react-icons/fa";

import "./LoadingSpinner.css";

const LoadingSpinner = (props) => {
  let content = (
    <div className="loading-spinner__overlay">
      <FaBinoculars color="grey" size={50} style={{ margin: "5px" }} />

      <div className="lds-dual-ring"></div>
    </div>
  );

  return ReactDOM.createPortal(
    content,
    document.getElementById("loading-hook")
  );
};

export default LoadingSpinner;
