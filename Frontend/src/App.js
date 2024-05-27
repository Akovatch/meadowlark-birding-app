import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Routes,
} from "react-router-dom";
import { Bounce, ToastContainer } from "react-toastify";

import Landing from "./landing/Landing";
import AllLocations from "./locations/pages/AllLocations";
import NewLocation from "./locations/pages/NewLocation";
import UserLocations from "./locations/pages/UserLocations";
import UserStats from "./user/pages/UserStats";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import ViewLocation from "./locations/pages/ViewLocation";
import Auth from "./user/pages/Auth";
import FilterPanel from "./shared/components/UIElements/FilterPanel";
import Footer from "./shared/components/Navigation/Footer";
import NotFound from "./shared/components/Navigation/NotFound";
import { AuthContext } from "./shared/context/auth-context";
import { useAuth } from "./shared/hooks/auth-hook";
import { FilterContext } from "./shared/context/filter-context";
import { useFilters } from "./shared/hooks/filters-hook";

import "react-toastify/dist/ReactToastify.css";
import "./App.css";

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

  console.log(token);

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
        <Route path="*" element={<Auth />} />
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
            <main>{routes}</main>
            <Footer />
          </Router>
        </FilterContext.Provider>
      </AuthContext.Provider>
      <ToastContainer theme="dark" autoClose={2000} />
    </>
  );
}

export default App;
