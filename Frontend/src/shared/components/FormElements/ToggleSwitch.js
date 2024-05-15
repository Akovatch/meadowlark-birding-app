import React from "react";
import "./ToggleSwitch.css";

export default function ToggleSwitch(props) {
  return (
    <div className="stats-filters">
      <input
        className="toggle-input"
        id={props.name}
        type="checkbox"
        name={props.name}
        checked={props.toggleValue}
        onChange={() => props.handleToggleChange((prev) => !prev)}
      />
      <label htmlFor={props.name} className="toggle">
        <div className="slider"></div>
      </label>
    </div>
  );
}
