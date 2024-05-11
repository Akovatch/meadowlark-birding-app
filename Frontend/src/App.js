import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

import Landing from "./landing/Landing";
import AllLocations from "./locations/pages/AllLocations";
import NewLocation from "./locations/pages/NewLocation";
import UserLocations from "./locations/pages/UserLocations";
import UserStats from "./user/pages/UserStats";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import ViewLocation from "./locations/pages/ViewLocation";
import Auth from "./user/pages/Auth";
import FilterPanel from "./shared/components/UIElements/FilterPanel";
import Footer from "./Footer";
import { AuthContext } from "./shared/context/auth-context";
import { useAuth } from "./shared/hooks/auth-hook";

import { FilterContext } from "./shared/context/filter-context";
import { useFilters } from "./shared/hooks/filters-hook";

import { ToastContainer } from "react-toastify";
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

  if (token) {
    routes = (
      // "Routes" (rather than Switch) is preferred in modern versions of react-router-dom
      <Switch>
        <Route path="/" exact>
          <Landing />
        </Route>
        <Route path="/locations" exact>
          <FilterPanel>
            <AllLocations />
          </FilterPanel>
        </Route>
        <Route path="/:userId/locations" exact>
          <FilterPanel>
            <UserLocations />
          </FilterPanel>
        </Route>
        <Route path="/:userId/stats" exact>
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
        {/* <Route path="/:userId/locations" exact>
          <UserLocations />
        </Route> */}
        <Route path="/locations/new" exact>
          {/* This solves the problem of /new being mistaken for a :locationId, but seems like a hack */}
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

// <div className="vertical-pane">
//                 <SplitPane
//                   split="vertical"
//                   minSize={200}
//                   paneStyle={{ height: "auto", overflowY: "scroll" }}
//                 >
//                   <MapFilter />
//                   <div className="content-pane">{routes}</div>
//                 </SplitPane>
//               </div>
//               <div className="horizontal-pane">
//                 <SplitPane
//                   split="horizontal"
//                   minSize={200}
//                   paneStyle={{ height: "auto", overflowY: "scroll" }}
//                 >
//                   <MapFilter />
//                   <div className="content-pane">{routes}</div>
//                 </SplitPane>
//               </div>
