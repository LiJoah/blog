import { observable, action } from "mobx";
import { StoreExt } from "@helpers/ReactExt";

class GlobalStore extends StoreExt<{}> {
  @observable timer: number = 0;

  @action
  add() {
    this.timer++;
  }

  @action
  reset() {
    this.timer = 0;
  }
}

export default new GlobalStore();
