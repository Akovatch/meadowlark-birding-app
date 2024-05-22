import React, { useEffect, useState, useContext } from "react";

import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import LocationsDisplayMap from "../../maps/LocationsDisplayMap";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { FilterContext } from "../../shared/context/filter-context";
import { filterLocations } from "../../shared/util/filterHelpers";

export default function AllLocations() {
  const [loadedLocations, setLoadedLocations] = useState();
  const { speciesFilter, yearFilter, monthsFilter } = useContext(FilterContext);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    async function fetchLocations() {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/locations`
        );
        setLoadedLocations(responseData.locations);
      } catch (err) {}
    }
    fetchLocations();
  }, [sendRequest]);

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedLocations && (
        <LocationsDisplayMap
          locations={filterLocations(
            loadedLocations,
            speciesFilter,
            yearFilter,
            monthsFilter
          )}
        />
      )}
    </>
  );
}
