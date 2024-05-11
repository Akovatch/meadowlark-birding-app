import React, { useState } from "react";

import Map, { Marker, NavigationControl, GeolocateControl } from "react-map-gl";

export default function NewLocationMap(props) {
  const [markerCoordinates, setMarkerCoordinates] = useState(null);

  const [viewState, setViewState] = React.useState({
    longitude: -73.990593,
    latitude: 40.740121,
    zoom: 10.0,
  });

  function handleClick(evt) {
    props.getCoordinates({ lng: evt.lngLat.lng, lat: evt.lngLat.lat });
    setMarkerCoordinates({ lng: evt.lngLat.lng, lat: evt.lngLat.lat });
  }

  return (
    <Map
      reuseMaps
      mapboxAccessToken={process.env.REACT_APP_MAPBOX_KEY}
      {...viewState}
      onMove={(evt) => setViewState(evt.viewState)}
      style={{ height: 400 }}
      cursor="crosshair"
      onClick={handleClick}
      mapStyle="mapbox://styles/mapbox/streets-v12?optimize=true"
    >
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
