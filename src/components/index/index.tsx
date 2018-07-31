import * as React from "react";
import "./index.less";

export interface Props {}

export default class Index extends React.Component<Props, object> {
  render() {
    return (
      <div className="hello">
        <div className="greeting">index</div>
      </div>
    );
  }
}
