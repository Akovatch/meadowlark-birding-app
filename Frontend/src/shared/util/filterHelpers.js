export function filterLocations(
  loadedLocations,
  speciesFilter,
  yearFilter,
  monthsFilter
) {
  let locations = loadedLocations;

  let selectedMonthIndexes = [];
  if (monthsFilter.length !== 0)
    monthsFilter.forEach((month, index) => {
      if (month.checked) {
        selectedMonthIndexes.push(index);
      }
    });

  if (
    speciesFilter === "All Species" &&
    yearFilter === "All Years" &&
    selectedMonthIndexes.length === 0
  ) {
    return locations;
  }

  return locations.filter((location) => {
    return location.sightings.find((sighting) => {
      return (
        (speciesFilter === "All Species" ||
          sighting.species === speciesFilter) &&
        (yearFilter === "All Years" ||
          new Date(sighting.date).getFullYear() === yearFilter) &&
        (selectedMonthIndexes.length === 0 ||
          selectedMonthIndexes.includes(new Date(sighting.date).getMonth()))
      );
    });
  });
}

export function filterSightings(
  sightings,
  speciesFilter,
  yearFilter,
  monthsFilter
) {
  let filteredSightings = sightings;

  if (speciesFilter !== "All Species") {
    filteredSightings = filteredSightings.filter((sighting) => {
      return sighting.species === speciesFilter;
    });
  }

  if (yearFilter !== "All Years") {
    filteredSightings = filteredSightings.filter((sighting) => {
      return new Date(sighting.date).getFullYear() === yearFilter;
    });
  }

  let selectedMonthIndexes = [];
  monthsFilter.forEach((month, index) => {
    if (month.checked) {
      selectedMonthIndexes.push(index);
    }
  });

  if (selectedMonthIndexes.length) {
    filteredSightings = filteredSightings.filter((sighting) => {
      return selectedMonthIndexes.includes(new Date(sighting.date).getMonth());
    });
  }

  return filteredSightings;
}

export function filterStats(
  sightings,
  searchFilter,
  yearFilter,
  startDateFilter,
  endDateFilter,
  uniqueFilter
) {
  let filteredSightings = sightings;

  if (yearFilter) {
    filteredSightings = filteredSightings.filter((sighting) => {
      return new Date(sighting.date).getFullYear() === yearFilter;
    });
  }

  if (startDateFilter && endDateFilter) {
    filteredSightings = filteredSightings.filter((sightings) => {
      let sightingDate = new Date(sightings.date);
      return sightingDate > startDateFilter && sightingDate < endDateFilter;
    });
  }

  if (searchFilter) {
    filteredSightings = filteredSightings.filter((sighting) => {
      const regex = new RegExp(searchFilter, "gi");
      return (
        regex.test(sighting.location.title) ||
        regex.test(sighting.species) ||
        regex.test(sighting.note)
      );
    });
  }

  if (uniqueFilter) {
    const results = [];
    filteredSightings.forEach((sighting) => {
      if (!results.find((item) => item.species === sighting.species)) {
        results.push(sighting);
      }
    });

    filteredSightings = results;
  }

  return filteredSightings;
}

export function getSightingsCount(
  sightings,
  speciesFilter,
  yearFilter,
  monthsFilter
) {
  let filteredSightings = sightings;

  if (speciesFilter !== "All Species") {
    filteredSightings = filteredSightings.filter((sighting) => {
      return sighting.species === speciesFilter;
    });
  }

  if (yearFilter !== "All Years") {
    filteredSightings = filteredSightings.filter((sighting) => {
      return new Date(sighting.date).getFullYear() === yearFilter;
    });
  }

  let selectedMonthIndexes = [];
  monthsFilter.forEach((month, index) => {
    if (month.checked) {
      selectedMonthIndexes.push(index);
    }
  });

  if (selectedMonthIndexes.length) {
    filteredSightings = filteredSightings.filter((sighting) => {
      return selectedMonthIndexes.includes(new Date(sighting.date).getMonth());
    });
  }

  return filteredSightings.length;
}
