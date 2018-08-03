import * as React from "react";
import { ReactComponentExt } from "@helpers/ReactExt";
import globalStore from "@store/globalStore";
import { DatePicker } from "antd";
import * as styles from "./home.less";

interface HomeProps {}
interface HomeStates {}

export class Home extends ReactComponentExt<HomeProps, HomeStates> {
  constructor(props: HomeProps) {
    super(props);
    this.clickHandler = this.clickHandler.bind(this);
  }

  private clickHandler() {
    globalStore.add();
    console.log(globalStore.timer);
  }

  render() {
    return (
      <div>
        <DatePicker />
        <button className={styles.hello} onClick={this.clickHandler}>
          click me
        </button>
      </div>
    );
  }
}
