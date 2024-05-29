import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";

import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";

export default function StatsTable(props) {
  const [selectedSighting, setSelectedSighting] = useState(null);
  const [clearSelection, setClearSelection] = useState(false);

  function sortSpecies(rowA, rowB) {
    let a = rowA.species;
    let b = rowB.species;

    if (a > b) {
      return 1;
    }

    if (b > a) {
      return -1;
    }
  }

  function sortLocation(rowA, rowB) {
    let a = rowA.location.props.children;
    let b = rowB.location.props.children;

    if (a > b) {
      return 1;
    }

    if (b > a) {
      return -1;
    }
  }

  function sortDate(rowA, rowB) {
    function convertToDays(dateString) {
      let dateArr = dateString.split("/");
      let day = Number(dateArr[1]);
      let month = Number(dateArr[0]);
      let year = Number(dateArr[2]);

      return year * 365 + month * 30 + day;
    }

    let a = convertToDays(rowA.date);
    let b = convertToDays(rowB.date);

    if (a < b) {
      return 1;
    }

    if (b < a) {
      return -1;
    }
  }

  const sightingsColumns = [
    {
      name: "Species",
      selector: (row) => row.species,
      sortable: true,
      sortFunction: sortSpecies,
    },
    {
      name: "Location",
      selector: (row) => row.location,
      sortable: true,
      sortFunction: sortLocation,
    },
    {
      name: "Date",
      selector: (row) => row.date,
      sortable: true,
      sortFunction: sortDate,
    },
    {
      name: "Note",
      selector: (row) => row.note,
      sortable: false,
    },
  ];

  const sightingsData = props.sightings.map((sighting, index) => {
    let date = new Date(sighting.date);
    return {
      id: sighting.id,
      species: sighting.species,
      location: (
        <Link to={`/location/${sighting.location.id}`}>
          {sighting.location.title}
        </Link>
      ),
      date: `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`,
      note: sighting.note,
    };
  });

  const handleRowSelected = useCallback(
    (state) => {
      console.log(state.selectedRows);

      if (state.selectedRows.length > 0) {
        let selectedRow = props.sightings.find(
          (sighting) => sighting.id === state.selectedRows[0].id
        );
        setSelectedSighting(selectedRow);
      } else {
        setSelectedSighting(null);
      }
    },
    [props.sightings]
  );

  function returnInfoLink() {
    if (!selectedSighting) {
      return;
    }

    let path = selectedSighting.species
      .toLowerCase()
      .replace("'", "")
      .split(" ")
      .join("-");

    return "https://www.audubon.org/field-guide/bird/" + path;
  }

  function contextActions() {
    return (
      <Button href={returnInfoLink()} key="info">
        Info
      </Button>
    );
  }

  return (
    <Card>
      <DataTable
        title={"Total Sightings: " + props.sightings.length}
        columns={sightingsColumns}
        data={sightingsData}
        defaultSortFieldId={3}
        selectableRows
        selectableRowsSingle
        clearSelectedRows={clearSelection}
        onSelectedRowsChange={handleRowSelected}
        contextActions={contextActions()}
        contextMessage={{
          singular: "sighting",
          message: "selected",
        }}
        pagination
      />
    </Card>
  );
}
