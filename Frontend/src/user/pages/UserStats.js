import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CountUp from "react-countup";

import StatsTable from "../components/StatsTable";
import StatsFilter from "../../filters/StatsFilter";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { filterStats } from "../../shared/util/filterHelpers";

import "./UserStats.css";

export default function UserStats() {
  const [loadedSightings, setLoadedSightings] = useState();
  const [statsSpecies, setStatsSpecies] = useState("All Species");
  const [statsYear, setStatsYear] = useState("All Years");
  const [statsStartDate, setStatsStartDate] = useState();
  const [statsEndDate, setStatsEndDate] = useState();
  const [statsUnique, setStatsUnique] = useState(false);
  const [statsSearch, setStatsSearch] = useState("");

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const { userId } = useParams();

  useEffect(() => {
    async function fetchSightings() {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/sightings/user/${userId}`
        );
        setLoadedSightings(responseData.sightings);
      } catch (err) {}
    }
    fetchSightings();
  }, [sendRequest, userId]);

  function getUniqueSightings(sightings) {
    const results = [];
    sightings.forEach((sighting) => {
      if (!results.find((item) => item.species === sighting.species)) {
        results.push(sighting);
      }
    });

    return results;
  }

  function getCurrentYearSightings(sightings) {
    return getUniqueSightings(sightings).filter((sighting) => {
      return new Date(sighting.date).getFullYear() === new Date().getFullYear();
    });
  }

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedSightings && (
        <div className="mystats-container">
          <div className="mystats-image-background">
            <div className="mystats-total-count">
              <h2 className="mystats-total-count-h2">Total Species</h2>
              <h2 className="mystats-total-count-h2">
                {
                  <CountUp
                    duration={5}
                    end={getUniqueSightings(loadedSightings).length}
                  />
                }
              </h2>
            </div>
            <div className="mystats-year-count">
              <h2 className="mystats-total-count-h2">This Year</h2>
              <h2 className="mystats-total-count-h2">
                <CountUp
                  duration={5}
                  end={getCurrentYearSightings(loadedSightings).length}
                />
              </h2>
            </div>
          </div>

          <StatsFilter
            species={statsSpecies}
            year={statsYear}
            startDate={statsStartDate}
            endDate={statsEndDate}
            unique={statsUnique}
            search={statsSearch}
            setSpecies={setStatsSpecies}
            setYear={setStatsYear}
            setStartDate={setStatsStartDate}
            setEndDate={setStatsEndDate}
            setUnique={setStatsUnique}
            setSearch={setStatsSearch}
          />
          <StatsTable
            sightings={filterStats(
              loadedSightings,
              statsSpecies,
              statsSearch,
              statsYear,
              statsStartDate,
              statsEndDate,
              statsUnique
            )}
          />
        </div>
      )}
    </>
  );
}
