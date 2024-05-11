import { createContext } from "react";

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

export const FilterContext = createContext({
  speciesFilter: "All Species",
  yearFilter: "All Years",
  monthsFilter: checkboxOptions,
});
