import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";

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
      <Switch>
        <Route path="/" exact>
          <Landing />
        </Route>
        <Route path="/locations" exact>
          <FilterPanel>
            <AllLocations />
          </FilterPanel>
        </Route>
        <Route path="/:userId/locations">
          <FilterPanel>
            <UserLocations />
          </FilterPanel>
        </Route>
        <Route path="/:userId/stats">
          <UserStats />
        </Route>
        <Route path="/locations/new" exact>
          <NewLocation />
        </Route>
        <Route path="/locations/:locationId">
          <FilterPanel>
            <ViewLocation />
          </FilterPanel>
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Landing />
        </Route>
        <Route path="/locations" exact>
          <FilterPanel>
            <AllLocations />
          </FilterPanel>
        </Route>
        <Route path="/locations/new" exact>
          <Redirect to="/auth" />
        </Route>
        <Route path="/locations/:locationId">
          <FilterPanel>
            <ViewLocation />
          </FilterPanel>
        </Route>
        <Route path="/auth">
          <Auth />
        </Route>
        <Redirect to="/auth" />
      </Switch>
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
      <ToastContainer theme="dark" />
    </>
  );
}

export default App;
