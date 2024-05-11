import React, { useContext, useState } from "react";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import options from "../../data";
import {
  VALIDATOR_MAXLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import { toast } from "react-toastify";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { FcCollapse } from "react-icons/fc";

import "./NewSighting.css";

// locationId(passed in), species, date, note
export default function NewSighting(props) {
  const auth = useContext(AuthContext);
  const [formState, inputHandler, setFormData] = useForm(
    {
      species: {
        value: "",
        isValid: false,
      },
      date: {
        value: "",
        isValid: true,
      },
      note: {
        value: null, // SHOULD THIS BE EMPTY STRING?
        isValid: true,
      },
    },
    false
  );
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  async function sightingSubmitHandler(event) {
    event.preventDefault();

    try {
      let newSighting = {
        species: formState.inputs.species.value,
        date: formState.inputs.date.value,
        note: formState.inputs.note.value,
        locationId: props.locationId,
      };

      let responseData = await sendRequest(
        "http://localhost:5000/api/sightings",
        "POST",
        JSON.stringify(newSighting),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      resetForm();
      props.updateSightings((prevSightings) => [
        ...prevSightings,
        responseData.sighting,
      ]);
      toast.success("Sighting added successfully!");
    } catch (err) {}
  }

  function resetForm() {
    setFormData(
      {
        species: {
          value: "",
          isValid: false,
        },
        date: {
          value: "",
          isValid: false,
        },
        note: {
          value: "",
          isValid: true,
        },
      },
      false
    );
  }

  if (!props.panelOpen) {
    return (
      <div className="newsighting-open-button-row">
        <Button onClick={props.openPanel}>
          ADD SIGHTING{" "}
          <MdOutlineAddCircleOutline
            style={{
              position: "relative",
              top: "3px",
              left: "5px",
            }}
            size={18}
          />
        </Button>
      </div>
    );
  }

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />

      <div className="newsighting-container">
        <form className="newsighting-form" onSubmit={sightingSubmitHandler}>
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="newsighting-field-group">
            <h4 className="newsighting-field-label">Species</h4>
            <Input
              className="newsighting-field-input"
              id="species"
              element="select"
              type="select"
              options={options}
              initialValue="Select..."
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a valid species."
              onInput={inputHandler}
            />
          </div>
          <div className="newsighting-field-group">
            <h4 className="newsighting-field-label">Date</h4>
            <Input
              className="newsighting-field-input"
              id="date"
              element="date"
              type="date"
              validators={[]}
              initialValid={true}
              initialValue={new Date().toJSON()}
              optionalInput={true}
              errorText="Please enter a valid date."
              onInput={inputHandler}
            />
          </div>
          <div className="newsighting-field-group">
            <h4 className="newsighting-field-label">Note</h4>
            <Input
              className="newsighting-field-input"
              id="note"
              element="input"
              type="text"
              validators={[VALIDATOR_MAXLENGTH(50)]}
              errorText="Please enter a valid note."
              initialValid={true}
              optionalInput={true}
              onInput={inputHandler}
            />
          </div>
          <div className="newsighting-button-field-group">
            <div id="newsighting-button">
              <Button
                className="newsighting-button"
                type="submit"
                disabled={!formState.isValid}
              >
                ADD SIGHTING
              </Button>
            </div>
          </div>
        </form>
        <div className="newsighting-close-button-container">
          <button onClick={props.closePanel}>
            <FcCollapse style={{ color: "black" }} />
          </button>
        </div>
      </div>
    </>
  );
}
