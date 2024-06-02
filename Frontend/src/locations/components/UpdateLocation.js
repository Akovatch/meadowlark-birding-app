import React, { useContext } from "react";
import { toast } from "react-toastify";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { VALIDATOR_REQUIRE } from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

export default function UpdateLocation(props) {
  const auth = useContext(AuthContext);
  const { isLoading, sendRequest } = useHttpClient();

  const [formState, inputHandler] = useForm(
    {
      title: {
        value: props.title,
        isValid: false,
      },
    },
    false
  );

  async function locationUpdateSubmitHandler(event) {
    event.preventDefault();
    try {
      const response = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/locations/${props.locationId}`,
        "PATCH",
        JSON.stringify({
          title: formState.inputs.title.value,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );

      // alter the name in ViewLocation
      updateLoadedLocation(response.location.title);
      props.closeModal();
      toast.success("Location edited successfully!");
    } catch (err) {
      props.closeModal();
      toast.error("Location could not be edited.");
    }
  }

  function updateLoadedLocation(title) {
    props.handleSubmit((prevLoadedLocation) => {
      return { ...prevLoadedLocation, title: title };
    });
  }

  return (
    <>
      {isLoading && <LoadingSpinner asOverlay />}
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title."
        onInput={inputHandler}
        initialValue={props.title}
        initialValid={true}
      />
      <Button
        type="submit"
        onClick={locationUpdateSubmitHandler}
        disabled={!formState.isValid}
      >
        UPDATE LOCATION
      </Button>
      <Button inverse onClick={props.closeModal}>
        CANCEL
      </Button>
    </>
  );
}
