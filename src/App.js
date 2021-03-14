import "rsuite/dist/styles/rsuite-default.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import WelcomePage from "./pages/WelcomePage";
import SettingsPage from "./pages/SettingsPage";
import React from "react";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    if (window.api === undefined && window.location.pathname === "/") {
      window.history.pushState({ directory: "browser" }, "Editor", "/editor");
      window.location.replace("/editor");
    }

    this.theme = "dark";
  }

  render() {
    return (
      <Router>
        <div className="app">
          <Switch>
            <Route path="/editor">
              <MainPage theme={this.theme} />
            </Route>
            <Route path="/settings">
              <SettingsPage />
            </Route>
            <Route path="/">
              <WelcomePage />
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}
