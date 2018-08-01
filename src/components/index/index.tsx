import * as React from "react";
import { hot } from "react-hot-loader";
import Loadable from "react-loadable";
import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import "./index.less";

const Home = Loadable({
  /* webpackChunkName: "home" */
  loader: () => import("../home/home")
})

const Login = Loadable({
  /* webpackChunkName: "login" */
  loader: () => import("../login/login")
});

export interface Props {}

const AppWrapper = (props: any) => {
  return <div className="app-wrapper">{props.children}</div>;
};

// 权限控制
const PrivateRoute = ({ component: any, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      true ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/login",
            state: { from: props.location }
          }}
        />
      )
    }
  />
);

class Index extends React.Component<Props, object> {
  render() {
    return (
      <AppWrapper>
        <Router>
          <Switch>
            <Route exact path="/login" component={Login} />
            <PrivateRoute path="/" component={Home} />
          </Switch>
        </Router>
      </AppWrapper>
    );
  }
}


export default hot(module)(Index)