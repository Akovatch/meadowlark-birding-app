import React, { useContext } from "react";
import { toast } from "react-toastify";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import options from "../../data";
import { VALIDATOR_REQUIRE } from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

export default function EditSighting(props) {
  const auth = useContext(AuthContext);

  const [formState, inputHandler] = useForm(
    {
      species: {
        value: props.species,
        isValid: true,
      },
      date: {
        value: props.date,
        isValid: true,
      },
      note: {
        value: props.note,
        isValid: true,
      },
    },
    true
  );
  const { isLoading, sendRequest } = useHttpClient();

  async function sightingSubmitHandler(event) {
    event.preventDefault();
    try {
      let response = await sendRequest(
        `http://localhost:5000/api/sightings/${props.id}`,
        "PATCH",
        JSON.stringify({
          species: formState.inputs.species.value,
          date: formState.inputs.date.value,
          note: formState.inputs.note.value,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );

      props.updateSightings((prevSightings) => {
        let filteredSightings = prevSightings.filter(
          (sighting) => sighting.id !== props.id
        );

        return [...filteredSightings, response.sighting];
      });
      props.resetTableSelection();
      props.closeModal();
      toast.success("Sighting updated successfully!");
    } catch (err) {
      props.closeModal();
      toast.error("Sighting could not be edited.");
    }
  }

  return (
    <>
      <form className="sighting-form" onSubmit={sightingSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="species"
          element="select"
          type="select"
          options={options}
          label="Species"
          initialValue={props.species}
          initialValid={true}
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid species."
          onInput={inputHandler}
        />
        <Input
          id="date"
          element="date"
          type="date"
          label="Date"
          validators={[]}
          initialValid={true}
          initialValue={props.date}
          optionalInput={true}
          errorText="Please enter a valid date."
          onInput={inputHandler}
        />
        <Input
          id="note"
          element="input"
          type="text"
          label="Note"
          initialValue={props.note}
          initialValid={true}
          validators={[]}
          errorText="Please enter a valid note."
          optionalInput={true}
          onInput={inputHandler}
        />
        <Button type="submit" disabled={!formState.isValid}>
          EDIT SIGHTING
        </Button>
        <Button type="button" inverse onClick={props.closeModal}>
          CANCEL
        </Button>
      </form>
    </>
  );
}
