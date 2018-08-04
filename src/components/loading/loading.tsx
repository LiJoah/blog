import * as React from "react";
import * as styles from "./loading.less"

export function Loading(props: any) {
  if (props.error) {
    return <div className={styles.view}>Error!</div>;
  } else if (props.timedOut) {
    return <div>Taking a long time...</div>;
  } else if (props.pastDelay) {
    return <div>Loading...</div>;
  } else {
    return null;
  }
}