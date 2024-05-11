import { useState } from "react";

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

export function useFilters() {
  const [speciesFilter, setSpeciesFilter] = useState("All Species");
  const [yearFilter, setYearFilter] = useState("All Years");
  const [monthsFilter, setMonthsFilter] = useState(checkboxOptions);

  return {
    speciesFilter,
    yearFilter,
    monthsFilter,
    setSpeciesFilter,
    setYearFilter,
    setMonthsFilter,
  };
}
