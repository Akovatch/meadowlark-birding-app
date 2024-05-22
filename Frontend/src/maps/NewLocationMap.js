import React, { useState, useEffect } from "react";
import Map, { Marker, NavigationControl, GeolocateControl } from "react-map-gl";
import GeocoderControl from "./GeocoderControl";
import "./GeocoderControl.css";

export default function NewLocationMap(props) {
  const [markerCoordinates, setMarkerCoordinates] = useState(null);

  const [viewState, setViewState] = useState({
    longitude: -73.990593,
    latitude: 40.740121,
    zoom: 10.0,
  });

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

  function handleClick(evt) {
    props.touchHander();
    props.getCoordinates({ lng: evt.lngLat.lng, lat: evt.lngLat.lat });
    setMarkerCoordinates({ lng: evt.lngLat.lng, lat: evt.lngLat.lat });
  }

  return (
    <Map
      reuseMaps
      mapboxAccessToken={process.env.REACT_APP_MAPBOX_KEY}
      {...viewState}
      onMove={(evt) => setViewState(evt.viewState)}
      style={{
        height: "400px",
        overflow: "hidden",
      }}
      cursor="crosshair"
      onClick={handleClick}
      mapStyle="mapbox://styles/mapbox/streets-v12?optimize=true"
      scrollZoom={false}
    >
      <GeocoderControl
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_KEY}
        position="top-right"
      />
      <NavigationControl />
      <GeolocateControl />
      {markerCoordinates && (
        <Marker
          longitude={markerCoordinates.lng}
          latitude={markerCoordinates.lat}
          anchor="bottom"
          draggable
        ></Marker>
      )}
    </Map>
  );
}
