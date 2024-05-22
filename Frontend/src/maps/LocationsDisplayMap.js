import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import Map, {
  Marker,
  NavigationControl,
  Popup,
  GeolocateControl,
} from "react-map-gl";

import GeocoderControl from "./GeocoderControl";
import "./GeocoderControl.css";

import FiltersNotification from "../filters/FiltersNotification";
import { AuthContext } from "../shared/context/auth-context";
import redPin from "../images/pin-red.png";
import yellowPin from "../images/pin-yellow.png";

import "./LocationsDisplayMap.css";

export default function LocationsDisplayMap(props) {
  const auth = useContext(AuthContext);

  const [viewState, setViewState] = useState({
    longitude: -73.990593,
    latitude: 40.740121,
    zoom: 8.0,
  });

  const [popupInfo, setPopupInfo] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setViewState({
        ...viewState,
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        zoom: 8.0,
      });
    });
  }, []);

  function generateMarkers() {
    let markers = props.locations.map((location) => {
      return (
        <div key={location.id}>
          <Marker
            longitude={location.coordinates.lng}
            latitude={location.coordinates.lat}
            anchor="bottom"
          >
            <Link to={`/location/${location.id}`}>
              <div
                onMouseEnter={() => {
                  setPopupInfo(location);
                }}
                onMouseLeave={() => {
                  setPopupInfo(null);
                }}
              >
                <img
                  src={location.creator === auth.userId ? yellowPin : redPin}
                  alt="location pin"
                  style={{ width: 20 }}
                />
              </div>
            </Link>
          </Marker>
        </div>
      );
    });

    return markers;
  }

  return (
    <>
      <FiltersNotification />
      <Map
        className="map"
        reuseMaps
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_KEY}
        {...viewState}
        style={{
          height: "600px",
          width: "auto",
          overflow: "hidden",
          border: "1px solid black",
          borderRadius: "10px",
          margin: "0 10px",
        }}
        onMove={(evt) => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/streets-v12?optimize=true"
        scrollZoom={false}
      >
        <GeocoderControl
          mapboxAccessToken={process.env.REACT_APP_MAPBOX_KEY}
          position="top-right"
          marker={true}
        />
        <NavigationControl />
        <GeolocateControl />
        {props.locations && generateMarkers()}
        {popupInfo && (
          <Popup
            className="map-tooltip"
            anchor="top"
            longitude={popupInfo.coordinates.lng}
            latitude={popupInfo.coordinates.lat}
            onClose={() => setPopupInfo(null)}
            style={{ padding: "0", margin: "0" }}
          >
            <div className="popup-content">
              <div className="popup-title">
                <strong>{popupInfo.title}</strong>
              </div>
              <div className="popup-number">
                <em>{popupInfo.sightings.length} sightings</em>
              </div>
            </div>
          </Popup>
        )}
      </Map>
    </>
  );
}

// Deleted from the head:  <link href='https://api.mapbox.com/mapbox-gl-js/v2.8.1/mapbox-gl.css' rel='stylesheet' />
