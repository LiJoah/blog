import "./index.less";
import * as React from "react";
import * as Loadable from "react-loadable";
import { hot } from "react-hot-loader";

import {
  // Switch,
  Route
  // Redirect
} from "react-router-dom";

import { Loading } from "../loading/loading";

const Home = Loadable({
  loader: () => {
    return import("../home/home");
  },
  loading: (props: any) => Loading(props),
  render: (loaded, props) => {
    console.log(props);
    console.log(loaded);
    return <loaded.Home {...props} />;
  }
});

const Login = Loadable({
  loader: () => {
    return import("../login/login");
  },
  loading: (props: any) => Loading(props),
  render: (loaded, props) => {
    console.log(props);
    return <loaded.Login {...props} />;
  }
});

export interface Props {}

const AppWrapper = (props: any) => (
  <div className="hello">{props.children}</div>
);

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
