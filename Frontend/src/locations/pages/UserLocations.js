import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";

import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import LocationsDisplayMap from "../../maps/LocationsDisplayMap";
import { FilterContext } from "../../shared/context/filter-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { filterLocations } from "../../shared/util/filterHelpers";

export default function UserLocations() {
  const [loadedLocations, setLoadedLocations] = useState();
  const { speciesFilter, yearFilter, monthsFilter } = useContext(FilterContext);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const { userId } = useParams();

  useEffect(() => {
    async function fetchLocations() {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/locations/user/${userId}`
        );
        setLoadedLocations(responseData.locations);
      } catch (err) {}
    }
    fetchLocations();
  }, [sendRequest, userId]);

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
