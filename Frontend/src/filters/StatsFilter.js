import React, { useContext, useState } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { MdInfoOutline } from "react-icons/md";

import ToggleSwitch from "../shared/components/FormElements/ToggleSwitch";
import speciesOptions from "../data";

import "./StatsFilter.css";
import "react-datepicker/dist/react-datepicker.css";

export default function StatsFilter(props) {
  // const [showTooltip, setShowTooltip] = useState(false);

  function generateYearOptions() {
    let yearOptions = [];
    let startingYear = 2023;
    let currentYear = new Date().getFullYear();
    let year = startingYear;

    while (year <= currentYear) {
      yearOptions.push({ label: year, value: year });
      year += 1;
    }

    return yearOptions;
  }

  function resetHandler() {
    props.setSpecies("All Species");
    props.setYear("All Years");
    props.setStartDate(undefined);
    props.setEndDate(undefined);
    props.setUnique(false);
    props.setSearch("");
  }

  function filterSelected() {
    return (
      props.species !== "All Species" ||
      props.year !== "All Years" ||
      props.startDate ||
      props.endDate ||
      props.unique ||
      props.search
    );
  }

  return (
    <div className="stats-form-container">
      <div className="stats-form-row">
        <div className="stats-field-group">
          <h3 className="stats-field-label">Species</h3>
          <Select
            className="stats-field-input"
            options={speciesOptions}
            onChange={(option) => props.setSpecies(option.value)}
            value={{
              label: props.species,
              value: props.species,
            }}
          />
        </div>
        <div className="stats-field-group">
          <h3 className="stats-field-label">Year</h3>
          <Select
            className="stats-field-input"
            options={generateYearOptions()}
            onChange={(option) => props.setYear(option.value)}
            value={{
              label: props.year,
              value: props.year,
            }}
          />
        </div>
      </div>
      <div className="stats-form-row" id="date-unique-row">
        <div className="stats-field-group">
          <h3 className="stats-field-label" id="stats-date-label">
            Date Range
          </h3>
          <div className="stats-dates-container">
            <div className="stats-date-input">
              <DatePicker
                className="start-date"
                selected={props.startDate}
                onChange={(date) => props.setStartDate(date)}
                selectsStart
                startDate={props.startDate}
                endDate={props.endDate}
                placeholderText="Start Date"
              />
            </div>
            <p> - </p>
            <div className="stats-date-input">
              <DatePicker
                className="end-date"
                selected={props.endDate}
                onChange={(date) => props.setEndDate(date)}
                selectsEnd
                startDate={props.startDate}
                endDate={props.endDate}
                minDate={props.startDate}
                placeholderText="End Date"
              />
            </div>
          </div>
        </div>
        <div className="stats-field-group" id="unique-field">
          <div
            className="stats-unique-label-container tooltip"
            // onMouseEnter={() => setShowTooltip(true)}
            // onMouseLeave={() => setShowTooltip(false)}
          >
            {/* {showTooltip && <div className="tooltiptext">Tooltip!</div>} */}
            <div className="tooltiptext">
              Removes duplicate sightings of the same species
            </div>
            <h3 className="stats-unique-label">Unique</h3>
            <MdInfoOutline
              style={{
                position: "relative",
                top: "9px",
                left: "-20px",
              }}
              size={18}
            />
          </div>
          <div className="stats-unique-input">
            <ToggleSwitch
              name="unique"
              toggleValue={props.unique}
              handleToggleChange={props.setUnique}
            />
          </div>
        </div>
      </div>
      <div className="stats-form-row">
        <div className="stats-field-group">
          <h3 className="stats-field-label">Search</h3>
          <input
            className="stats-field-input"
            id="search-box"
            type="search"
            value={props.search}
            onChange={(event) => props.setSearch(event.target.value)}
          />
        </div>
        <div className="stats-clear-all-container stats-field-input">
          <button
            className={
              filterSelected()
                ? "stats-clear-all stats-clear-all-active"
                : "stats-clear-all"
            }
            onClick={() => resetHandler()}
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
}
