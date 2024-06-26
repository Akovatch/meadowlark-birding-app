import React, { useContext } from "react";
import Select from "react-select";
import { FcCollapse } from "react-icons/fc";
import { FcExpand } from "react-icons/fc";
import { CSSTransition } from "react-transition-group";

import Checkbox from "../shared/components/FormElements/Checkbox";
import speciesOptions from "../data";
import { FilterContext } from "../shared/context/filter-context";

import "./MapFilter.css";
import "react-datepicker/dist/react-datepicker.css";

export default function MapFilter(props) {
  let checkboxOptions = [
    { value: "Jan", checked: false },
    { value: "Feb", checked: false },
    { value: "Mar", checked: false },
    { value: "Apr", checked: false },
    { value: "May", checked: false },
    { value: "Jun", checked: false },
    { value: "Jul", checked: false },
    { value: "Aug", checked: false },
    { value: "Sep", checked: false },
    { value: "Oct", checked: false },
    { value: "Nov", checked: false },
    { value: "Dec", checked: false },
  ];

  const {
    speciesFilter,
    yearFilter,
    monthsFilter,
    setSpeciesFilter,
    setYearFilter,
    setMonthsFilter,
  } = useContext(FilterContext);

  function checkboxChangeHandler(currVal, boxName) {
    let updatedMonths = monthsFilter.slice();

    let changedOption = updatedMonths.find((month) => month.value === boxName);
    changedOption.checked = !currVal;

    setMonthsFilter(updatedMonths);
  }

  function generateMonthCheckboxes(orientation) {
    let checkboxElements = monthsFilter.map((month) => {
      return (
        <Checkbox
          key={month.value}
          option={month.value}
          checked={month.checked}
          handleChange={checkboxChangeHandler}
        />
      );
    });

    return (
      <>
        <div className="filter-month-column">
          {[checkboxElements[0], checkboxElements[6]]}
        </div>
        <div className="filter-month-column">
          {[checkboxElements[1], checkboxElements[7]]}
        </div>
        <div className="filter-month-column">
          {[checkboxElements[2], checkboxElements[8]]}
        </div>
        <div className="filter-month-column">
          {[checkboxElements[3], checkboxElements[9]]}
        </div>
        <div className="filter-month-column">
          {[checkboxElements[4], checkboxElements[10]]}
        </div>
        <div className="filter-month-column">
          {[checkboxElements[5], checkboxElements[11]]}
        </div>
      </>
    );
  }

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

  function resetHandler(field) {
    switch (field) {
      case "species":
        setSpeciesFilter("All Species");
        break;
      case "year":
        setYearFilter("All Years");
        break;
      case "months":
        setMonthsFilter(checkboxOptions);
        break;
      case "all":
        setSpeciesFilter("All Species");
        setYearFilter("All Years");
        setMonthsFilter(checkboxOptions);
        break;
      default:
        return;
    }
  }

  function togglePanelOpen() {
    props.setPanelOpen((prevPanelOpen) => !prevPanelOpen);
  }

  function filterSelected() {
    return (
      speciesFilter !== "All Species" ||
      yearFilter !== "All Years" ||
      monthsFilter.find((option) => option.checked)
    );
  }

  let mapFilterContent = (
    <div className="mapfilter-container">
      <div className="filter-row">
        <div className="filter-field-group">
          <h3 className="filter-label">Species</h3>
          <div className="filter-controls">
            <Select
              className="filter-input"
              id="filter-species-select"
              options={speciesOptions}
              onChange={(option) => setSpeciesFilter(option.value)}
              value={{
                label: speciesFilter,
                value: speciesFilter,
              }}
            />
          </div>
        </div>
        <div className="filter-field-group">
          <h3 className="filter-label">Year</h3>
          <div className="filter-controls">
            <Select
              className="filter-input"
              options={generateYearOptions()}
              onChange={(option) => setYearFilter(option.value)}
              value={{
                label: yearFilter,
                value: yearFilter,
              }}
            />
          </div>
        </div>
      </div>
      <div className="filter-row">
        <div className="filter-field-group">
          <h3 className="filter-label">Months</h3>
          <div className="filter-controls">
            <div className="filter-months-input">
              {generateMonthCheckboxes("grid")}
            </div>
          </div>
        </div>
        <div className="filter-clear-all-field-group">
          <button
            className={`filter-clear-all ${
              filterSelected() ? "clear-filters-button-active" : ""
            }`}
            onClick={() => resetHandler("all")}
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {!props.windowWide && (
        <div className="filter-close-button-row">
          <button
            onClick={() => togglePanelOpen()}
            style={{ cursor: "pointer" }}
          >
            Filters {props.panelOpen ? <FcCollapse /> : <FcExpand />}
          </button>
        </div>
      )}
      {props.windowWide ? (
        mapFilterContent
      ) : (
        <CSSTransition
          in={props.panelOpen}
          mountOnEnter
          unmountOnExit
          timeout={500}
          classNames="filter-panel"
        >
          {mapFilterContent}
        </CSSTransition>
      )}
    </>
  );
}
