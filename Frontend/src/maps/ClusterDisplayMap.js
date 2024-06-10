import React, { useState, useContext, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Map, {
  Marker,
  NavigationControl,
  Popup,
  GeolocateControl,
} from "react-map-gl";
import useSupercluster from "use-supercluster";
import GeocoderControl from "./GeocoderControl";
import { FaMapMarkerAlt } from "react-icons/fa";

import FiltersNotification from "../filters/FiltersNotification";
import { AuthContext } from "../shared/context/auth-context";

import "./ClusterDisplayMap.css";
import "./GeocoderControl.css";

export default function LocationsDisplayMap(props) {
  const auth = useContext(AuthContext);

  const [viewState, setViewState] = useState(
    JSON.parse(localStorage.getItem("coordinates")) || {
      longitude: -73.990593,
      latitude: 40.740121,
      zoom: 6.0,
    }
  );

  const [mapRef, setMapRef] = useState(null);
  const [popupInfo, setPopupInfo] = useState(null);

  // sets map to user's coordinates on page load
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setViewState({
        ...viewState,
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        zoom: 6.0,
      });
    });

    localStorage.setItem(
      "coordinates",
      JSON.stringify({
        latitude: viewState.latitude,
        longitude: viewState.longitude,
        zoom: 6.0,
      })
    );
  }, []);

  const points = props.locations.map((location) => ({
    type: "Feature",
    properties: {
      cluster: false,
      location: location,
      locationId: location.id,
    },
    geometry: {
      type: "Point",
      coordinates: [location.coordinates.lng, location.coordinates.lat],
    },
  }));

  // get bounds using mapbox-gl methods
  const bounds = mapRef ? mapRef.getMap().getBounds().toArray().flat() : null;

  // get clusters, passing info required by useSupercluster hook
  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom: viewState.zoom,
    options: { radius: 75, maxZoom: 20 },
  });

  console.log(points);
  console.log(clusters);

  const flyIntoCluster = useCallback((longitude, latitude, zoom) => {
    mapRef.flyTo({
      center: [longitude, latitude],
      duration: 2000,
      zoom: zoom,
    });
  });

  function generateClusters() {
    return clusters.map((cluster) => {
      const [longitude, latitude] = cluster.geometry.coordinates;
      const { cluster: isCluster, point_count: pointCount } =
        cluster.properties;

      if (isCluster) {
        return (
          <Marker key={cluster.id} latitude={latitude} longitude={longitude}>
            <div
              className={
                props.community
                  ? "cluster-marker-all"
                  : "cluster-marker-my-stats"
              }
              style={{
                width: `${10 + (pointCount / points.length) * 20}px`,
                height: `${10 + (pointCount / points.length) * 20}px`,
              }}
              onClick={() => {
                const expansionZoom = Math.min(
                  supercluster.getClusterExpansionZoom(cluster.id),
                  20
                );
                flyIntoCluster(
                  cluster.geometry.coordinates[0],
                  cluster.geometry.coordinates[1],
                  expansionZoom
                );
              }}
            >
              {pointCount}
            </div>
          </Marker>
        );
      }

      return (
        <div key={cluster.properties.locationId}>
          <Marker longitude={longitude} latitude={latitude} anchor="bottom">
            <Link to={`/location/${cluster.properties.locationId}`}>
              <div
                onMouseEnter={() => {
                  setPopupInfo(cluster.properties.location);
                }}
                onMouseLeave={() => {
                  setPopupInfo(null);
                }}
              >
                <FaMapMarkerAlt
                  size="30"
                  style={{
                    color:
                      cluster.properties.location.creator === auth.userId
                        ? "#FB5E10"
                        : "#8D48FB",
                  }}
                />
              </div>
            </Link>
          </Marker>
        </div>
      );
    });
  }

  return (
    <>
      <FiltersNotification />
      <Map
        className="map"
        reuseMaps
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_KEY}
        initialViewState={viewState}
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
        ref={(ref) => setMapRef(ref)}
        mapStyle="mapbox://styles/mapbox/streets-v12?optimize=true"
        scrollZoom={true}
      >
        <GeocoderControl
          mapboxAccessToken={process.env.REACT_APP_MAPBOX_KEY}
          position="top-right"
          marker={true}
        />
        <NavigationControl />
        <GeolocateControl />
        {props.locations && generateClusters()}
        {popupInfo && (
          <Popup
            className="map-tooltip"
            anchor="top"
            longitude={popupInfo.coordinates.lng}
            latitude={popupInfo.coordinates.lat}
            onClose={() => setPopupInfo(null)}
            style={{ padding: "0", margin: "0", textAlign: "center" }}
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
