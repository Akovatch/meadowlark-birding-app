import React from "react";
import YoutubeEmbed from "../shared/components/UIElements/YoutubeEmbed";

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
      <div className="landing-info-container-grey">
        <div className="video-container">
          <YoutubeEmbed embedId="429vVZc4nS0" />
        </div>
        <h3 className="landing-info-description-grey">
          Watch a demo video to discover the many features of Meadowlark
        </h3>
      </div>
      <div className="landing-info-container-purple">
        <img
          className="landing-info-image-purple"
          src={community}
          alt="Screenshot of Community Sightings page"
        />
        <h3 className="landing-info-description-purple">
          Filter our database of Community Sightings to locate specific species
          in your area
        </h3>
      </div>
      <div className="landing-info-container-grey">
        <img
          className="landing-info-image-grey"
          src={viewlocation}
          alt="Screenshot of View Location page"
        />

        <h3 className="landing-info-description-grey">
          Select a location pin to view, add, edit, and delete the sightings of
          a birding hot spot
        </h3>
      </div>{" "}
      <div className="landing-info-container-purple">
        <img
          className="landing-info-image-purple"
          src={mysightings}
          alt="Screenshot of My Sightings page"
        />
        <h3 className="landing-info-description-purple">
          View and filter your own sightings, organized by location, on the My
          Sightings map
        </h3>
      </div>
      <div className="landing-info-container-grey">
        <img
          className="landing-info-image-grey"
          src={addlocation}
          alt="Screenshot of Add Location page"
        />
        <h3 className="landing-info-description-grey">
          Add new birding hot spots to the database using the Add Location
          feature
        </h3>
      </div>
      <div className="landing-info-container-purple">
        <img
          className="landing-info-image-purple"
          src={mystats}
          alt="Screenshot of My Stats page"
        />
        <h3 className="landing-info-description-purple">
          Search, organize, and analyze your sighting data using the My Stats
          page.
        </h3>
      </div>
    </>
  );
}
