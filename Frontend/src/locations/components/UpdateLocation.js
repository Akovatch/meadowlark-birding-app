import React, { useContext } from "react";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { VALIDATOR_REQUIRE } from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import { toast } from "react-toastify";

import "./LocationForm.css";

export default function UpdateLocation(props) {
  // pass in props: title, locationId
  const auth = useContext(AuthContext);
  const { isLoading, sendRequest } = useHttpClient(); // removed isLoading

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
        `http://localhost:5000/api/locations/${props.locationId}`,
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

// import React, { useEffect, useState, useContext } from "react";
// import { useParams, useHistory } from "react-router-dom";

// import Input from "../../shared/components/FormElements/Input";
// import Button from "../../shared/components/FormElements/Button";
// import Card from "../../shared/components/UIElements/Card";
// import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
// import ErrorModal from "../../shared/components/UIElements/ErrorModal";
// import {
//   VALIDATOR_REQUIRE,
//   VALIDATOR_MINLENGTH,
// } from "../../shared/util/validators";
// import { useForm } from "../../shared/hooks/form-hook";
// import { useHttpClient } from "../../shared/hooks/http-hook";
// import { AuthContext } from "../../shared/context/auth-context";
// import "./LocationForm.css";

// export default function UpdateLocation() {
//   const auth = useContext(AuthContext);
//   const { isLoading, error, sendRequest, clearError } = useHttpClient();
//   const [loadedLocation, setLoadedLocation] = useState();
//   const locationId = useParams().locationId;
//   const history = useHistory();

//   const [formState, inputHandler, setFormData] = useForm(
//     {
//       title: {
//         value: "",
//         isValid: false,
//       },
//       description: {
//         value: "",
//         isValid: false,
//       },
//     },
//     false
//   );

//   useEffect(() => {
//     async function fetchLocation() {
//       try {
//         const responseData = await sendRequest(
//           `http://localhost:5000/api/locations/${locationId}`
//         );
//         setLoadedLocation(responseData.location);
//         setFormData(
//           {
//             title: {
//               value: responseData.location.title,
//               isValid: true,
//             },
//             description: {
//               value: responseData.location.description,
//               isValid: true,
//             },
//           },
//           true
//         );
//       } catch (err) {}
//     }

//     fetchLocation();
//   }, [sendRequest, locationId, setFormData]);

//   async function locationUpdateSubmitHandler(event) {
//     event.preventDefault();
//     try {
//       await sendRequest(
//         `http://localhost:5000/api/locations/${locationId}`,
//         "PATCH",
//         JSON.stringify({
//           title: formState.inputs.title.value,
//           description: formState.inputs.description.value,
//         }),
//         {
//           "Content-Type": "application/json",
//           Authorization: "Bearer " + auth.token,
//         }
//       );

//       history.push("/" + auth.userId + "/locations");
//     } catch (err) {}
//   }

//   if (isLoading) {
//     return (
//       <div className="center">
//         <LoadingSpinner />
//       </div>
//     );
//   }

//   if (!loadedLocation && !error) {
//     return (
//       <div className="center">
//         <Card>
//           <h2>Could not find location!</h2>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <>
//       <ErrorModal error={error} onClear={clearError} />
//       {!isLoading && loadedLocation && (
//         <form className="location-form" onSubmit={locationUpdateSubmitHandler}>
//           <Input
//             id="title"
//             element="input"
//             type="text"
//             label="Title"
//             validators={[VALIDATOR_REQUIRE()]}
//             errorText="Please enter a valid title."
//             onInput={inputHandler}
//             initialValue={loadedLocation.title}
//             initialValid={true}
//           />
//           <Input
//             id="description"
//             element="textarea"
//             label="Description"
//             validators={[VALIDATOR_MINLENGTH(5)]}
//             errorText="Please enter a valid description (min. 5 characters)."
//             onInput={inputHandler}
//             initialValue={loadedLocation.description}
//             initialValid={true}
//           />
//           <Button type="submit" disabled={!formState.isValid}>
//             UPDATE LOCATION
//           </Button>
//         </form>
//       )}
//     </>
//   );
// }
