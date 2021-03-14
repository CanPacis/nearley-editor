import App from "./App";
import "./index.css";
import React from "react";
import ReactDOM from "react-dom";

if (true) {
  import("rsuite/dist/styles/rsuite-dark.css");
	window.theme = "dark"
} else {
  import("rsuite/dist/styles/rsuite-default.css");
	window.theme = "light"
}

ReactDOM.render(<App />, document.getElementById("root"));
