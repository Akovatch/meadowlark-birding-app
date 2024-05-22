import React, { useReducer, useEffect } from "react";

import NewLocationMap from "../../../maps/NewLocationMap";

import "react-datepicker/dist/react-datepicker.css";
import "./Input.css";

// function coordinatesValid() {
//   // maxBounds: [
//   //   [-171.0, 73.0],
//   //   [-40.0, 12.0],
//   // ],

//   return (
//     inputState.value.lng > -171.0 &&
//     inputState.value.lng < -40.0 &&
//     inputState.value.lat < 73.0 &&
//     inputState.value.lat > 12.0
//   );
// }

function inputReducer(state, action) {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.val,
        isValid:
          action.val.lng > -171.0 &&
          action.val.lng < -40.0 &&
          action.val.lat < 73.0 &&
          action.val.lat > 12.0,
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
    <>
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
          className="form-control-input"
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
        {!inputState.isValid &&
          inputState.isTouched &&
          !props.optionalInput && <p>{props.errorText}</p>}
      </div>
      <NewLocationMap
        getCoordinates={inputChangeHandler}
        touchHander={touchHandler}
      />
    </>
  );
}
