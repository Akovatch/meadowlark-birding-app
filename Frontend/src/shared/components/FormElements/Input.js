// Code pulled from phase 1

import React, { useReducer, useEffect } from "react";
import DatePicker from "react-datepicker";
import Select from "react-select";

import "react-datepicker/dist/react-datepicker.css";

import { validate } from "../../util/validators";
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
    console.log(date.toJSON());
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
        showIcon
        selected={new Date(inputState.value)}
        // onBlur={touchHandler}
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

// This code is from when I was using Input for the filters...

// import React, { useRef, useReducer, useEffect } from "react";
// import ReactDOM from "react-dom";
// import DatePicker from "react-datepicker";
// import Select from "react-select";
// import Checkbox from "./Checkbox";

// import "react-datepicker/dist/react-datepicker.css";

// import { validate } from "../../util/validators";
// import "./Input.css";

// function inputReducer(state, action) {
//   switch (action.type) {
//     case "CHANGE":
//       return {
//         ...state,
//         value: action.val,
//         isValid: validate(action.val, action.validators),
//       };
//     case "TOUCH":
//       return {
//         ...state,
//         isTouched: true,
//       };

//     default:
//       return state;
//   }
// }

// export default function Input(props) {
//   const [inputState, dispatch] = useReducer(inputReducer, {
//     value: props.initialValue || "",
//     isTouched: false,
//     isValid: props.initialValid || false,
//   });

//   const { id, onInput } = props;
//   const { value, isValid } = inputState;

//   useEffect(() => {
//     props.onInput(id, value, isValid);
//   }, [id, value, isValid, onInput]);

//   function inputChangeHandler(event) {
//     dispatch({
//       type: "CHANGE",
//       val: event.target.value,
//       validators: props.validators,
//     });
//   }

//   function dateChangeHandler(date) {
//     dispatch({
//       type: "CHANGE",
//       val: date.toJSON(),
//       validators: props.validators,
//     });
//   }

//   function selectChangeHandler(option) {
//     dispatch({
//       type: "CHANGE",
//       val: option.value,
//       validators: props.validators,
//     });
//   }
//   // [{value: "Jan", checked: false}, ...]   // / / / / /  . . . / / / / / / / / / / / / / / / / / / / / / / /

//   function checkboxChangeHandler(prevChecked, name) {
//     let optionsArray = inputState.value.slice();

//     let changedOption = optionsArray.find((obj) => obj.value === name);
//     changedOption.checked = !prevChecked;

//     dispatch({
//       type: "CHANGE",
//       val: optionsArray,
//       validators: props.validators,
//     });
//   }
//   function touchHandler() {
//     dispatch({
//       type: "TOUCH",
//     });
//   }

//   function resetHandler() {
//     dispatch({
//       type: "CHANGE",
//       val: props.initialValue || "",
//       validators: props.validators,
//     });
//   }

//   console.log(`Input render:${inputState.value}`);

//   let element;
//   if (props.element === "input") {
//     element = (
//       <input
//         id={props.id}
//         type={props.type}
//         placeholder={props.placeholder}
//         onChange={inputChangeHandler}
//         onBlur={touchHandler}
//         value={inputState.value}
//       />
//     );
//   } else if (props.element === "select") {
//     element = (
//       <Select
//         options={props.options}
//         onChange={selectChangeHandler}
//         value={{
//           label: inputState.value,
//           value: inputState.value,
//         }}
//       />
//     );
//   } else if (props.element === "date") {
//     element = (
//       <DatePicker
//         showIcon
//         selected={new Date(inputState.value)}
//         // onBlur={touchHandler}
//         onChange={(date) => dateChangeHandler(date)}
//       />
//     );
//   } else if (props.element === "dates") {
//     element = (
//       <DatePicker
//         showIcon
//         selected={new Date(inputState.value)}
//         // onBlur={touchHandler}
//         onChange={(date) => dateChangeHandler(date)}
//       />
//     );
//   } else if (props.element === "checkboxes") {
//     let checkboxElements = inputState.value.map((option) => {
//       return (
//         <Checkbox
//           key={option.value}
//           option={option.value}
//           checked={option.checked}
//           handleChange={checkboxChangeHandler}
//         />
//       );
//     });

//     element = <div className="checkboxes">{checkboxElements}</div>;
//   }

//   return (
//     <div
//       className={`form-control ${
//         !inputState.isValid &&
//         inputState.isTouched &&
//         !props.optionalInput &&
//         "form-control--invalid"
//       }`}
//     >
//       <label htmlFor={props.id}>{props.label}</label>
//       {element}
//       <button onClick={resetHandler}>Reset</button>
//       {!inputState.isValid && inputState.isTouched && !props.optionalInput && (
//         <p>{props.errorText}</p>
//       )}
//     </div>
//   );
// }
