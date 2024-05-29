import React, { useState, useContext, useCallback, useEffect } from "react";
import DataTable from "react-data-table-component";
import { toast } from "react-toastify";
import { BiEditAlt } from "react-icons/bi";
import { RiDeleteBinLine } from "react-icons/ri";

import EditSighting from "./EditSighting";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";

import Card from "../../shared/components/UIElements/Card";
import "./SightingsTable.css";

export default function SightingsTable(props) {
  const [selectedSighting, setSelectedSighting] = useState(null);
  const [showEditSightingModal, setEditSightingModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [clearSelection, setClearSelection] = useState(false);

  const { isLoading, sendRequest } = useHttpClient();
  const auth = useContext(AuthContext);

  useEffect(() => {
    function removeContextHeader() {
      let container = document.getElementsByClassName(
        "sightingstable-container"
      )[0];
      let divToRemove =
        container.firstElementChild.firstElementChild.nextElementSibling
          .firstElementChild;
      divToRemove.remove();
    }
    removeContextHeader();
  }, []);

  function openEditModalHandler() {
    setEditSightingModal(true);
  }
  function closeEditModalHandler() {
    setEditSightingModal(false);
  }

  function showDeleteWarningHandler() {
    setShowConfirmModal(true);
  }

  function cancelDeleteHandler() {
    setShowConfirmModal(false);
  }

  async function confirmDeleteHandler() {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        `http://localhost:5000/api/sightings/${selectedSighting.id}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      props.onDeleteSighting(selectedSighting.id);
      resetTableSelection();
      toast.success("Sighting deleted successfully!");
    } catch (err) {
      toast.error("Sighting could not be edited.");
    }
  }

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

  function generateTableData() {
    return props.sightings.map((sighting) => {
      let date = new Date(sighting.date);
      return {
        id: sighting.id,
        species: sighting.species,
        location: sighting.location.title,
        date: `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`,
        note: sighting.note,
      };
    });
  }

  const handleRowSelected = useCallback(
    (state) => {
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

  function resetTableSelection() {
    setSelectedSighting(null);
    setClearSelection((prev) => !prev);
  }

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

  function contextActionsLoggedIn() {
    return (
      <>
        <Button href={returnInfoLink()} key="info">
          Info
        </Button>
        <Button key="edit" onClick={openEditModalHandler}>
          <BiEditAlt />
        </Button>
        <Button key="delete" onClick={showDeleteWarningHandler}>
          <RiDeleteBinLine />
        </Button>
      </>
    );
  }

  function contextActionsLoggedOut() {
    return (
      <Button href={returnInfoLink()} key="info">
        Info
      </Button>
    );
  }

  return (
    <>
      <Modal
        show={showEditSightingModal}
        onCancel={closeEditModalHandler}
        header={"Edit Sighting"}
        contenClass="sighting-item__modal-content"
      >
        {selectedSighting && (
          <EditSighting
            closeModal={closeEditModalHandler}
            id={selectedSighting.id}
            creatorId={selectedSighting.creator.id}
            locationId={selectedSighting.location}
            species={selectedSighting.species}
            date={selectedSighting.date}
            note={selectedSighting.note}
            updateSightings={props.updateSightings}
            resetTableSelection={resetTableSelection}
          />
        )}
      </Modal>

      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="sighting-item__modal-actions"
        footer={
          <>
            {isLoading && <LoadingSpinner asOverlay />}

            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </>
        }
      >
        <p>
          Do you want to proceed and delete this sighting? Please note that it
          can't be undone thereafter.
        </p>
      </Modal>

      <Card className="sightingstable-container">
        {auth.userId === props.location.creator.id ? (
          <DataTable
            title={"Total Sightings: " + props.sightings.length}
            columns={sightingsColumns}
            data={generateTableData()}
            defaultSortFieldId={2}
            selectableRows
            selectableRowsSingle
            clearSelectedRows={clearSelection}
            onSelectedRowsChange={handleRowSelected}
            contextActions={contextActionsLoggedIn()}
            contextMessage={{
              singular: "",
              message: "selected",
            }}
            pagination
          />
        ) : (
          <DataTable
            title={"Total Sightings: " + props.sightings.length}
            columns={sightingsColumns}
            data={generateTableData()}
            defaultSortFieldId={2}
            selectableRows
            selectableRowsSingle
            clearSelectedRows={clearSelection}
            onSelectedRowsChange={handleRowSelected}
            contextActions={contextActionsLoggedOut()}
            contextMessage={{
              singular: "sighting",
              message: "selected",
            }}
            pagination
          />
        )}
      </Card>
    </>
  );
}
