import React, { useReducer, useEffect } from "react";
import DatePicker from "react-datepicker";
import Select from "react-select";

import { validate } from "../../util/validators";

import "react-datepicker/dist/react-datepicker.css";
import "./Input.css";

function inputReducer(state, action) {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators),
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

export default function Input(props) {
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

  function inputChangeHandler(event) {
    dispatch({
      type: "CHANGE",
      val: event.target.value,
      validators: props.validators,
    });
  }

  function dateChangeHandler(date) {
    if (!date) {
      date = new Date();
    }

    dispatch({
      type: "CHANGE",
      val: date.toJSON(),
      validators: props.validators,
    });
  }

  function selectChangeHandler(option) {
    dispatch({
      type: "CHANGE",
      val: option.value,
      validators: props.validators,
    });
  }

  function touchHandler() {
    dispatch({
      type: "TOUCH",
    });
  }

  let element;
  if (props.element === "input") {
    element = (
      <input
        className="input-height"
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        maxLength="40"
        onChange={inputChangeHandler}
        onBlur={touchHandler}
        value={inputState.value}
      />
    );
  } else if (props.element === "select") {
    element = (
      <Select
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            height: "auto",
          }),
        }}
        options={props.options}
        onChange={selectChangeHandler}
        value={{
          label: inputState.value,
          value: inputState.value,
        }}
      />
    );
  } else {
    element = (
      <DatePicker
        selected={new Date(inputState.value)}
        onChange={(date) => dateChangeHandler(date)}
      />
    );
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
      {props.label && <label htmlFor={props.id}>{props.label}</label>}
      {element}
      {!inputState.isValid && inputState.isTouched && !props.optionalInput && (
        <p>{props.errorText}</p>
      )}
    </div>
  );
}
