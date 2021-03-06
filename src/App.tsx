import React from "react";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
} from "react-router-dom";

import { Main } from "./views/Main";
import { Results } from "./views/Results";
import { History } from "./views/History";
import "./tailwind.output.css";
import "antd/dist/antd.less";
import "./index.css";
import { Database, Search } from "react-feather";

function Menu() {
  return (
    <nav className="min-h-screen w-48  bg-blue-400 shadow-md py-16 px-2">
      <ul>
        <li className="mb-2">
          <NavLink
            to="/"
            exact={true}
            activeClassName="bg-white text-blue-400 "
            className="text-lg text-white flex items-center py-2 px-2 transition rounded-xl hover:text-blue-100"
          >
            <Search />
            <span className="py-1 font-medium px-4">Rezultaty</span>
          </NavLink>
        </li>
        <li className="mb-2">
          <NavLink
            to="/search"
            activeClassName="bg-white text-blue-400 "
            className="text-lg text-white flex items-center py-2 px-2 transition rounded-xl hover:text-blue-100"
          >
            <Database />
            <span className="py-1 font-medium px-4">Wyszukaj</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="flex bg-gray-100">
        <Menu />
        <div className="flex-1 p-16">
          <Switch>
            <Route path="/results/:jobId/:depth">
              <Results />
            </Route>
            <Route path="/results/:jobId/">
              <Results />
            </Route>
            <Route path="/search">
              <Main />
            </Route>
            <Route path="/">
              <History />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
