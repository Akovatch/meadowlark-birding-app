import React, { useContext } from "react";

import { FilterContext } from "../shared/context/filter-context";
import { MdOutlineAddCircleOutline } from "react-icons/md";

import "./FiltersNotification.css";

// locationId(passed in), species, date, note
export default function FiltersNotification(props) {
  const { speciesFilter, yearFilter, monthsFilter } = useContext(FilterContext);

  function getMonthStrings() {
    return monthsFilter
      .filter((month) => month.checked === true)
      .map((month) => month.value);
  }

  function noFilters() {
    return (
      speciesFilter === "All Species" &&
      yearFilter === "All Years" &&
      getMonthStrings().length === 0
    );
  }
  return (
    <div className="filtersnotification-container">
      <h3 className="filtersnotification-heading">Filters: </h3>
      <ul className="filtersnotification-ul">
        {noFilters() && (
          <li
            id="filtersnotification-no-filters"
            className="filtersnotification-li"
          >
            <em>No filters applied.</em>
          </li>
        )}
        {speciesFilter !== "All Species" && (
          <li className="filtersnotification-li">{speciesFilter}</li>
        )}
        {yearFilter !== "All Years" && (
          <li className="filtersnotification-li">{yearFilter}</li>
        )}
        {getMonthStrings().length > 0 && getMonthStrings().length < 4 && (
          <li className="filtersnotification-li">
            {"Months: " + getMonthStrings().join(", ")}
          </li>
        )}
        {getMonthStrings().length > 3 && (
          <li className="filtersnotification-li">Months: 3+</li>
        )}
      </ul>
    </div>
  );
}
