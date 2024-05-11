import React, { useReducer, useEffect } from "react";
import NewLocationMap from "../../../maps/NewLocationMap";

import "react-datepicker/dist/react-datepicker.css";
import "./Input.css";

function inputReducer(state, action) {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.val,
        isValid: true,
      };
    case "TOUCH":
      return {
        ...state,
        isTouched: true,
      };

    default:
      return state;
  }
}

export default function MapInput(props) {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || "",
    isTouched: false,
    isValid: props.initialValid || false,
  });

  const { id, onInput } = props;
  const { value, isValid } = inputState;

  useEffect(() => {
    props.onInput(id, value, isValid);
  }, [id, value, isValid, onInput]);

  function inputChangeHandler(coordinates) {
    dispatch({
      type: "CHANGE",
      val: coordinates,
      validators: props.validators,
    });
  }

  function touchHandler() {
    dispatch({
      type: "TOUCH",
    });
  }

  return (
    <div
      className={`form-control ${
        !inputState.isValid &&
        inputState.isTouched &&
        !props.optionalInput &&
        "form-control--invalid"
      }`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      <input
        id={props.id}
        type={props.type}
        placeholder={"Click on Map..."}
        onChange={inputChangeHandler}
        onBlur={touchHandler}
        value={
          inputState.value &&
          `Longitude: ${inputState.value.lng}, Latitude: ${inputState.value.lat}`
        }
      />
      {!inputState.isValid && inputState.isTouched && !props.optionalInput && (
        <p>{props.errorText}</p>
      )}
      <NewLocationMap getCoordinates={inputChangeHandler} />
    </div>
  );
}
