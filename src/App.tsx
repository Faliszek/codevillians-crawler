import React from "react";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
} from "react-router-dom";

import { Main } from "./views/Main";
import { FAQ } from "./views/FAQ";
import { Results } from "./views/Results";
import "./tailwind.output.css";
import "antd/dist/antd.less";
import { Database, HelpCircle } from "react-feather";

function Menu() {
  return (
    <nav className="min-h-screen w-48  bg-blue-400 shadow-md py-16 px-2">
      <ul>
        <li>
          <NavLink
            to="/"
            activeClassName="bg-white text-blue-400 "
            className="text-lg text-white flex items-center py-2 px-2 transition rounded-xl"
          >
            <Database />
            <span className="py-1 font-medium px-4">Wyszukaj</span>
          </NavLink>
        </li>
        <NavLink
          to="/faq"
          exact={true}
          activeClassName="bg-white text-blue-400 "
          className="text-lg text-white flex items-center  py-2 px-2 transition rounded-xl"
        >
          <HelpCircle />
          <span className="py-1 font-medium px-4">FAQ</span>
        </NavLink>
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
            <Route path="/results">
              <Results />
            </Route>
            <Route path="/faq">
              <FAQ />
            </Route>
            <Route path="/">
              <Main />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
