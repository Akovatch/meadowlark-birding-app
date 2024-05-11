import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../shared/context/auth-context";

import redPin from "../images/pin-red.png";
import yellowPin from "../images/pin-yellow.png";

import Map, {
  Marker,
  NavigationControl,
  Popup,
  GeolocateControl,
} from "react-map-gl";
import FiltersNotification from "../filters/FiltersNotification";
import Card from "../shared/components/UIElements/Card";

import "./LocationsDisplayMap.css";

export default function LocationsDisplayMap(props) {
  const auth = useContext(AuthContext);

  const [viewState, setViewState] = useState({
    longitude: -73.990593,
    latitude: 40.740121,
    zoom: 10.0,
  });

  const [popupInfo, setPopupInfo] = useState(null);

  // {
  //   title: { type: String, required: true },
  //   coordinates: {
  //     lat: { type: Number, required: true },
  //     lng: { type: Number, required: true },
  //   },
  //   creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  //   sightings: [
  //     { type: mongoose.Types.ObjectId, required: true, ref: "Sighting" },
  //   ],
  // }

  function generateMarkers() {
    // iterate through array of location objects, converting each into a marker
    // give each an onClick callback prop that, for now, alerts the user of the name and number of sightings
    // return an array of Marker elements

    let markers = props.locations.map((location) => {
      return (
        <div key={location.id}>
          <Marker
            longitude={location.coordinates.lng}
            latitude={location.coordinates.lat}
            anchor="bottom"
          >
            <Link to={`/locations/${location.id}`}>
              <div
                onMouseEnter={() => {
                  setPopupInfo(location);
                }}
                onMouseLeave={() => {
                  setPopupInfo(null);
                }}
              >
                {/* <h2>{location.sightings.length}</h2> */}
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

// I deleted this from the head:  <link href='https://api.mapbox.com/mapbox-gl-js/v2.8.1/mapbox-gl.css' rel='stylesheet' />
