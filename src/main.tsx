import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "mobx-react";
import { configure } from "mobx";
import createBrowserHistory from "history/createBrowserHistory";
import { RouterStore, syncHistoryWithStore } from "mobx-react-router";
import { Router } from "react-router-dom";
import Index from "./components/index/index";

const browserHistory = createBrowserHistory();
const routingStore = new RouterStore();

const history = syncHistoryWithStore(browserHistory, routingStore);

// 不允许在动作外部修改状态
configure({ enforceActions: true });

ReactDOM.render(
  <Provider>
    <Router history={history}>
      <Index />
    </Router>
  </Provider>,
  document.getElementById("app") as HTMLElement
);