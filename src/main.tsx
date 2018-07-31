import * as ReactDOM from "react-dom";
import * as React from "react";
import Index from "./components/index/index";

let index = React.createElement(Index);

ReactDOM.render(index, document.getElementById("root") as HTMLElement);
