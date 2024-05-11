import React from "react";

export default function Checkbox(props) {
  return (
    <>
      <label className="checkbox-input">
        {props.option}
        <input
          type="checkbox"
          name={props.option}
          checked={props.checked}
          onChange={() => props.handleChange(props.checked, props.option)}
        />
      </label>
    </>
  );
}
