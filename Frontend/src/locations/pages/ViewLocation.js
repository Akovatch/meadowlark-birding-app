import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Map, { Marker } from "react-map-gl";
import { NavigationControl } from "react-map-gl";
import { BiEditAlt } from "react-icons/bi";
import { RiDeleteBinLine } from "react-icons/ri";
import { IoMdReturnLeft } from "react-icons/io";
import { toast } from "react-toastify";

import Card from "../../shared/components/UIElements/Card";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import Modal from "../../shared/components/UIElements/Modal";
import Button from "../../shared/components/FormElements/Button";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import UpdateLocation from "../components/UpdateLocation";
import LocationSightings from "../../sightings/components/LocationSightings";
import FiltersNotification from "../../filters/FiltersNotification";
import redPin from "../../images/pin-red.png";
import yellowPin from "../../images/pin-yellow.png";

import "./ViewLocation.css";

export default function ViewLocation() {
  const auth = useContext(AuthContext);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedLocation, setLoadedLocation] = useState();
  const locationId = useParams().locationId;

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showEditLocationModal, setShowEditLocationModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchLocation() {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/locations/${locationId}`
        );
        setLoadedLocation(responseData.location);
      } catch (err) {}
    }

    fetchLocation();
  }, [sendRequest, locationId]);

  function openEditLocationHandler() {
    setShowEditLocationModal(true);
  }

  function closeEditLocationHandler() {
    setShowEditLocationModal(false);
  }

  function openDeleteWarningHandler() {
    setShowConfirmModal(true);
  }

  function closeDeleteHandler() {
    setShowConfirmModal(false);
  }

  async function confirmDeleteHandler() {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        `http://localhost:5000/api/locations/${loadedLocation.id}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );

      toast.success("Location deleted successfully!");
      navigate("/" + auth.userId + "/locations");
    } catch (err) {}
  }

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedLocation && !error) {
    return (
      <div className="center" style={{ marginTop: "100px" }}>
        <Card>
          <h2>Location does not exist.</h2>
        </Card>
      </div>
    );
  }

  if (error) {
    return <ErrorModal error={error} onClear={clearError} />;
  }

  return (
    <>
      <Modal
        show={showEditLocationModal}
        onCancel={closeEditLocationHandler}
        header={"Edit Location Name"}
      >
        <UpdateLocation
          title={loadedLocation.title}
          locationId={loadedLocation.id}
          handleSubmit={setLoadedLocation}
          closeModal={closeEditLocationHandler}
        />
      </Modal>

      <Modal
        show={showConfirmModal}
        onCancel={closeDeleteHandler}
        header="Are you sure?"
        footer={
          <>
            <Button inverse onClick={closeDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </>
        }
      >
        <p>
          Do you want to proceed and delete this location? Please note that it
          can't be undone thereafter.
        </p>
      </Modal>

      <FiltersNotification />
      <div className="viewlocation-container">
        <div className="viewlocation-header-info">
          <h2 className="viewlocation-header-title">{loadedLocation.title}</h2>
          {auth.userId !== loadedLocation.creator.id && (
            <p className="viewlocation-creator">{`Creator: ${loadedLocation.creator.name}`}</p>
          )}
        </div>
        <div className="viewlocation-header">
          <div className="viewlocation-header-return-container">
            <Button type={"button"} onClick={() => navigate(-1)}>
              <IoMdReturnLeft />
            </Button>
          </div>

          <div className="viewlocation-header-controls">
            {auth.userId === loadedLocation.creator.id && (
              <Button onClick={openEditLocationHandler}>
                <BiEditAlt />
              </Button>
            )}
            {auth.userId === loadedLocation.creator.id && (
              <Button danger onClick={openDeleteWarningHandler}>
                <RiDeleteBinLine />
              </Button>
            )}
          </div>
        </div>
        <div className="viewlocation-map-container">
          <Map
            className="viewlocation-map"
            reuseMaps
            mapboxAccessToken={process.env.REACT_APP_MAPBOX_KEY}
            initialViewState={{
              longitude: loadedLocation.coordinates.lng,
              latitude: loadedLocation.coordinates.lat,
              zoom: 12,
            }}
            style={{ height: 200 }}
            mapStyle="mapbox://styles/mapbox/streets-v12?optimize=true"
            scrollZoom={false}
          >
            <NavigationControl />
            <Marker
              longitude={loadedLocation.coordinates.lng}
              latitude={loadedLocation.coordinates.lat}
              anchor="bottom"
            >
              <img
                src={
                  loadedLocation.creator.id === auth.userId ? yellowPin : redPin
                }
                alt="location pin"
                style={{ width: 20 }}
              />
            </Marker>
          </Map>
        </div>
        <div>
          <LocationSightings
            location={loadedLocation}
            setLocation={setLoadedLocation}
          />
        </div>
      </div>
    </>
  );
}
