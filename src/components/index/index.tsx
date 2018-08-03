import "./index.less";
import * as React from "react";
import { hot } from "react-hot-loader";
import Loadable from "react-loadable";
import {
  // Switch,
  Route
  // Redirect
} from "react-router-dom";

import { Loading } from "../loading/loading";

console.log(Loadable);

const Home = Loadable({
  loader: () => {
    return import("../home/home");
  },
  loading: Loading,
  render: (loaded, props) => {
    console.log(props);
    return loaded.Home;
  }
});

const Login = Loadable({
  loader: () => {
    return import("../login/login");
  },
  loading: Loading,
  render: (loaded, props) => {
    console.log(props);
    return loaded.Login;
  }
});

export interface Props {}

const AppWrapper = (props: any) => {
  return <div className="hello">{props.children}</div>;
};

// // 权限控制
// const PrivateRoute = ({ component: Component, ...rest }) => (
//   <Route
//     {...rest}
//     render={props =>
//       true ? (
//         <Component {...props} />
//       ) : (
//         <Redirect
//           to={{
//             pathname: "/login",
//             state: { from: props.location }
//           }}
//         />
//       )
//     }
//   />
// );

class Index extends React.Component<Props, object> {
  render() {
    return (
      <AppWrapper>
        <Route exact path="/login" component={Login} />
        <Route path="/" component={Home} />
      </AppWrapper>
    );
  }
}

export default hot(module)(Index);
