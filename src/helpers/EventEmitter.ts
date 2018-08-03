interface Handler<D> {
  (data: D): void;
}

export namespace EventEmitter {
  export interface EmittableEvents {}
}

type EmittableEvents = EventEmitter.EmittableEvents;

class EventListener {
  labels: string | string[]; //改动
  emitter: EventEmitter<any>;
  event: string;
  handler: Handler<any>;
  destroied: boolean = false;
  //改动
  constructor(
    event: string,
    handler: Handler<any>,
    labels: string | string[],
    emitter: EventEmitter<any>
  ) {
    this.event = event;
    this.handler = handler;
    this.labels = labels;
    this.emitter = emitter;
  }

  unregister() {
    this.emitter.off(this.event, this);
    this.destroy();
  }

  destroy(): boolean {
    if (this.destroied) {
      return false;
    }
    this.handler = null;
    this.emitter = null;
    this.destroied = true;
    return true;
  }
}

export class EventEmitter<E extends EmittableEvents> {
  eventTypings: E;
  protected _events: {
    [eventName: string]: EventListener[];
  } = {};

  constructor() {}

  /**
   * 绑定一个由此对象发生的特定事件的处理器，类似原生 js 中的 addEventListener，可以监听的事件由形参 E 指定
   * @param event 事件名称，必须是形参 E 中的 key
   * @param handler 事件处理函数，在事件发生时会被调用，参数中的 data 的类型由形参决定
   */
  on<N extends keyof E>(event: N, handler: Handler<E[N]>): EventListener;
  /**
   * 绑定一个由此对象发生的特定事件的处理器，类似原生 js 中的 addEventListener，可以监听的事件由形参 E 指定
   * @param event 事件名称，必须是形参 E 中的 key
   * @param labels 事件标签，如有多个则用空格隔开。注销事件时可以通过指定特定标签来注销事件
   * @param handler 事件处理函数，在事件发生时会被调用，参数中的 data 的类型由形参决定   *
   */
  on<N extends keyof E>(
    event: string,
    labels: string,
    handler: Handler<E[N]>
  ): EventListener;
  on<N extends keyof E>(
    event: string,
    handlerOrLabels?: Handler<E[N]> | string,
    handler?: Handler<E[N]>
  ): EventListener {
    // 改动
    let labels: string | string[];
    if (typeof handlerOrLabels === "function") {
      handler = handlerOrLabels;
      labels = null;
    } else {
      labels = handlerOrLabels;
    }
    if (!handler) {
      throw new TypeError("invlaid handler! --EventEmitter");
    }
    if (!this._events[event]) {
      this._events[event] = [];
    }
    if (typeof labels === "string") {
      labels = labels ? labels.split(" ") : null;
    }
    let listener = new EventListener(event, handler, labels, this);
    this._events[event].push(listener);
    return listener;
  }

  /**
   * 发射一个事件，可以发送的事件由形参 E 指定，发射后响应的监听器会被调用
   * @param event 事件名称，必须是形参 E 中的 key
   * @param data 事件数据，类型由形参 E 指定
   */
  emit<N extends keyof E>(event: N, data: E[N] = null): boolean {
    let evt = event as string;
    if (!this._events[evt]) {
      return false;
    }
    let remains: EventListener[] = [];
    for (let listener of this._events[evt]) {
      if (listener.destroied) {
        continue;
      }
      remains.push(listener);
      listener.handler.call(this, data);
    }
    if (remains.length !== this._events[evt].length) {
      this._events[evt] = remains;
    }
    return true;
  }

  /**
   * 移除指定事件的一个或多个监听器（取决于传入的target）,如果成功移除，会返回 true
   * @param event 事件名称
   * @param target 移除对象，如果不填，则移除所有监听此事件的对象。target可以是一个 EventListener 或者一个 label
   */
  off<N extends keyof E>(event: N, target?: EventListener | string): boolean {
    let evt = event as string;
    if (!this._events[evt]) {
      return false;
    }
    if (target) {
      if (target instanceof EventListener) {
        for (let arr = this._events[evt], i = 0; i < arr.length; i++) {
          let listener = arr[i];
          if (!(listener === target)) {
            continue;
          }
          this._events[evt] = this._events[evt].filter(l => {
            return l !== listener;
          });
          if (this._events[evt].length === 0) {
            delete this._events[evt];
          }
        }
        console.error(target);
        console.error(
          `Cannot find listenert of ${event} in ${this} --EventEmitter`
        );
      } else if (typeof target === "string") {
        let remains: EventListener[];
        for (let arr = this._events[evt], i = 0; i < arr.length; i++) {
          let listener = arr[i];
          let found: boolean = false;
          if (listener.labels) {
            // 改动
            for (let arr = listener.labels, i = 0; i < arr.length; i++) {
              let l = arr[i];
              if (!(l === target)) {
                continue;
              }
              found = true;
              break;
            }
          }
          if (!found) {
            remains.push(listener);
          } else {
            listener.destroy();
          }
          this._events[evt] = remains;
          if (this._events[evt].length === 0) {
            delete this._events[evt];
          }
        }
      } else {
        for (let arr = this._events[evt], i = 0; i < arr.length; i++) {
          let listener = arr[i];
          this._events[evt][i] = null;
          listener.destroy();
        }
        delete this._events[evt];
      }
    }
    return true;
  }

  removeAllListeners() {
    for (let name in this._events) {
      let events = this._events[name];
      for (let arr = events, i = 0; i < arr.length; i++) {
        events[i] = null;
      }
      this._events[name] = null;
    }
  }
}

export default EventEmitter;
