import * as React from "react";
import { message, notification } from "antd";
import { api } from "./api";
import { EventEmitter } from "./EventEmitter";

/**
 * 扩展组件/store类以方便调用
 * 集成api, 公用组件
 */
export class ReactComponentExt<P = {}, S = {}> extends React.Component<P, S> {
  readonly api = api;
  readonly $message = message;
  readonly $notification = notification;
}

export abstract class StoreExt<P> extends EventEmitter<P> {
  readonly api = api;
  readonly $message = message;
  readonly $notification = notification;
}
