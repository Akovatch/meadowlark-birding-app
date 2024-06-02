import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import MapInput from "../../shared/components/FormElements/MapInput";
import { VALIDATOR_REQUIRE } from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

import "./NewLocation.css";

export default function NewLocation() {
  const auth = useContext(AuthContext);
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      coordinates: {
        value: "",
        isValid: true,
      },
      sightings: {
        value: [],
        isValid: true,
      },
    },
    false
  );
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const navigate = useNavigate();

  async function locationSubmitHandler(event) {
    event.preventDefault();

    try {
      let responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/locations",
        "POST",
        JSON.stringify({
          title: formState.inputs.title.value,
          coordinates: formState.inputs.coordinates.value,
          sightings: formState.inputs.sightings.value,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      toast.success("New Location added!");
      navigate(`/location/${responseData.location.id}`);
    } catch (err) {}
  }

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <form className="newlocation-form">
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
          onInput={inputHandler}
        />
        <MapInput
          id="coordinates"
          element="input"
          type="text"
          label="Coordinates"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter coordinates in North America."
          onInput={inputHandler}
        />
        <Button
          type="button"
          onClick={locationSubmitHandler}
          disabled={!formState.isValid}
        >
          ADD LOCATION
        </Button>
      </form>
    </>
  );
}
