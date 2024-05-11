import React from "react";

import "./Map.css";

// This component would utilize google maps JS SDK, which requires
// an account and payment. Therefore, I simply added a placeholder below.
const Map = (props) => {
  return (
    <div className={`map ${props.className}`} style={props.style}>
      <h1>THIS IS A PLACEHOLDER FOR A MAP...</h1>
    </div>
  );
};

export default Map;
