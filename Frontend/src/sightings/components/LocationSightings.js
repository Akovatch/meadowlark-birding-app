import React, { useEffect, useState, useContext } from "react";

import NewSighting from "./NewSighting";
import SightingsTable from "./SightingsTable";
import { AuthContext } from "../../shared/context/auth-context";
import { FilterContext } from "../../shared/context/filter-context";
import { filterSightings } from "../../shared/util/filterHelpers";

export default function LocationSightings(props) {
  const auth = useContext(AuthContext);
  const { speciesFilter, yearFilter, monthsFilter } = useContext(FilterContext);
  const [sightings, setSightings] = useState(props.location.sightings);
  const [newSightingPanelOpen, setNewSightingPanelOpen] = useState(false);
  // const [windowNarrow, setWindowNarrow] = useState(window.innerWidth < 768);

  // function handleResize() {
  //   if (windowNarrow && window.innerWidth > 768) {
  //     setWindowNarrow(false);
  //   } else if (!windowNarrow && window.innerWidth < 768) {
  //     setWindowNarrow(true);
  //   }
  // }

  // window.addEventListener("resize", handleResize);

  useEffect(() => {
    props.setLocation((prevLocation) => {
      return { ...prevLocation, sightings: sightings };
    });
  }, [sightings]);

  function sightingDeletedHandler(deletedSightingId) {
    setSightings((prevSightings) =>
      prevSightings.filter((sighting) => sighting.id !== deletedSightingId)
    );
  }

  // function sortSightingsChronologically(sightings) {
  //   return sightings.sort((a, b) => {
  //     return new Date(b.date) - new Date(a.date);
  //   });
  // }

  return (
    <>
      {auth.userId === props.location.creator.id && (
        <NewSighting
          key={sightings.length} // passing in a unique key clears the form
          locationId={props.location.id}
          updateSightings={setSightings}
          panelOpen={newSightingPanelOpen}
          openPanel={() => setNewSightingPanelOpen(true)}
          closePanel={() => setNewSightingPanelOpen(false)}
        />
      )}
      <br />
      <SightingsTable
        sightings={filterSightings(
          sightings,
          speciesFilter,
          yearFilter,
          monthsFilter
        )}
        location={props.location}
        updateSightings={setSightings}
        onDeleteSighting={sightingDeletedHandler}
      />
    </>
  );
}
