import React, { Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Landing from "./landing/Landing";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import FilterPanel from "./shared/components/UIElements/FilterPanel";
import Footer from "./shared/components/Navigation/Footer";
import LoadingSpinner from "./shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "./shared/context/auth-context";
import { useAuth } from "./shared/hooks/auth-hook";
import { FilterContext } from "./shared/context/filter-context";
import { useFilters } from "./shared/hooks/filters-hook";

import "react-toastify/dist/ReactToastify.css";
import "./App.css";

const AllLocations = React.lazy(() => import("./locations/pages/AllLocations"));
const NewLocation = React.lazy(() => import("./locations/pages/NewLocation"));
const UserLocations = React.lazy(() =>
  import("./locations/pages/UserLocations")
);
const UserStats = React.lazy(() => import("./user/pages/UserStats"));
const ViewLocation = React.lazy(() => import("./locations/pages/ViewLocation"));
const Auth = React.lazy(() => import("./user/pages/Auth"));
const NotFound = React.lazy(() =>
  import("./shared/components/Navigation/NotFound")
);

function App() {
  const { token, login, logout, userId } = useAuth();
  const {
    speciesFilter,
    yearFilter,
    monthsFilter,
    setSpeciesFilter,
    setYearFilter,
    setMonthsFilter,
  } = useFilters();

  let routes;

  if (token) {
    routes = (
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="locations"
          element={
            <FilterPanel>
              <AllLocations />
            </FilterPanel>
          }
        ></Route>
        <Route
          path=":userId/locations"
          element={
            <FilterPanel>
              <UserLocations />
            </FilterPanel>
          }
        />
        <Route path=":userId/stats" element={<UserStats />} />
        <Route path="location/new" element={<NewLocation />} />
        <Route
          path="location/:locationId"
          element={
            <FilterPanel>
              <ViewLocation />
            </FilterPanel>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="locations"
          element={
            <FilterPanel>
              <AllLocations />
            </FilterPanel>
          }
        ></Route>
        <Route
          path="location/:locationId"
          element={
            <FilterPanel>
              <ViewLocation />
            </FilterPanel>
          }
        />
        <Route path="auth" element={<Auth />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    );
  }

  return (
    <>
      <AuthContext.Provider
        value={{ isLoggedIn: !!token, token: token, userId, login, logout }}
      >
        <FilterContext.Provider
          value={{
            speciesFilter,
            yearFilter,
            monthsFilter,
            setSpeciesFilter,
            setYearFilter,
            setMonthsFilter,
          }}
        >
          <Router>
            <MainNavigation />
            <main>
              <Suspense fallback={<LoadingSpinner />}>{routes}</Suspense>
            </main>
            <Footer />
          </Router>
        </FilterContext.Provider>
      </AuthContext.Provider>
      <ToastContainer theme="dark" autoClose={2000} />
    </>
  );
}

export default App;
