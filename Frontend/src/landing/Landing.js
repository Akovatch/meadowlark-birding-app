import React from "react";

import community from "../images/community.png";
import viewlocation from "../images/view-location.png";
import mysightings from "../images/my-sightings.png";
import addlocation from "../images/add-location.png";
import mystats from "../images/my-stats.png";

import "./Landing.css";

export default function Landing() {
  return (
    <>
      <div className="background">
        <div className="translucent-box">
          <h2>
            Find local hotspots, discover trends, and manage your North American
            bird sightings
          </h2>
        </div>
      </div>
      <div className="landing-info-container-purple">
        <img className="landing-info-image-purple" src={community} />
        <h3 className="landing-info-description-purple">
          Filter our database of Community Sightings to locate specific species
          in your area
        </h3>
      </div>
      <div className="landing-info-container-grey">
        <img className="landing-info-image-grey" src={viewlocation} />

        <h3 className="landing-info-description-grey">
          Select a location pin to view, add, edit, and delete sightings from a
          birding hot spot
        </h3>
      </div>{" "}
      <div className="landing-info-container-purple">
        <img className="landing-info-image-purple" src={mysightings} />
        <h3 className="landing-info-description-purple">
          View and filter your own sightings, organized by location, on the My
          Sightings map
        </h3>
      </div>
      <div className="landing-info-container-grey">
        <img className="landing-info-image-grey" src={addlocation} />
        <h3 className="landing-info-description-grey">
          Add new birding hot spots to the database using the Add Location
          feature
        </h3>
      </div>
      <div className="landing-info-container-purple">
        <img className="landing-info-image-purple" src={mystats} />
        <h3 className="landing-info-description-purple">
          Search, organize, and analyze your sighting data using the My Stats
          page.
        </h3>
      </div>
    </>
  );
}
