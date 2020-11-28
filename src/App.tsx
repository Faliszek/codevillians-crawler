import React from "react";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
} from "react-router-dom";

import { Main } from "./views/Main";
import { FAQ } from "./views/FAQ";
import "./tailwind.output.css";
import "antd/dist/antd.css";
import { Database, HelpCircle } from "react-feather";

function Menu() {
  return (
    <nav className="min-h-screen w-48  bg-blue-400 shadow-md py-16 px-2">
      <ul>
        <li>
          <NavLink
            to="/"
            exact={true}
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
        {/* <li>
          <Link to="/faq">
           
          </Link>
        </li> */}
      </ul>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="flex bg-gray-100">
        <Menu />
        {/* A <Switch> looks through its children <Route>s and
          renders the first one that matches the current URL. */}
        <div className="flex-1 p-16">
          <Switch>
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
