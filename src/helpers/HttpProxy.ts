import axios from "axios";
import utils from "./utils";
// import { storage } from "../helpers/storage";
import { configs } from "../config";

type APIQueryArgCollection = ApiTypes.APIBodyArgCollection;
type APIBodyArgCollection = ApiTypes.APIBodyArgCollection;
type ApiBaseResult = ApiTypes.ApiBaseResult;
type HTTPStatusCode = ApiTypes.HTTPStatusCode;

const BASE_SUCCESS_RESULT: ApiBaseResult = {
  success: true,
  statusCode: 200,
  statusMessage: "ok"
};

export class HttpProxy<Result = {}> {
  static mockError = false;
  // 认证错误码
  static readonly AUTH_ERROR_CODES = new Set([]);
  static commonErrorHandler(
    httpProxy: HttpProxy<any>,
    resData: ApiBaseResult,
    httpStatusCode: HTTPStatusCode,
    silent: boolean
  ) {
    console.log(`common error handler triggered: ${httpProxy.path}`, silent, {
      resData,
      httpStatusCode
    });
    if (!silent) {
      console.warn(
        "common error handler for non-silent api call:",
        httpProxy.path,
        "showing alert"
      );
    }
    if (resData) {
      if (this.AUTH_ERROR_CODES.has(resData.statusCode)) {
      } else {
        if (!silent) {
          setTimeout(() => {
            return alert(
              `请求失败，${resData.statusMessage} ${resData.statusCode}`
            );
          }, 1);
        }
      }
    }
  }

  private method: "GET" | "POST";
  private path: string;
  private postRaw: boolean = false;
  private defaultPrevented: boolean = false;
  private headers: { [name: string]: string } = {};
  private urlArgs?: APIQueryArgCollection;
  private bodyArgs?: APIBodyArgCollection;
  private rawBody?: Blob | string;
  private resultFilter: (res: any) => Result;
  private mockResult?: Result & ApiBaseResult;
  private mockDelay: number;
  private silent: boolean;

  //callbacks
  private onSuccess: (result: Result & ApiBaseResult) => true | void;
  private onFail: (httpStatusCode: HTTPStatusCode) => true | void;
  private onError: (msg: string, statusCode: number, data?: any) => true | void;
  private onFailOrError: (
    httpStatusCode: HTTPStatusCode,
    msg?: string,
    statusCode?: number,
    data?: any
  ) => true | void;
  private onAlways: () => void;

  constructor(
    method: "GET" | "POST",
    path: string,
    urlArgs?: APIQueryArgCollection,
    body?: APIBodyArgCollection | Blob | string
  ) {
    this.method = method;
    this.path = path;
    this.urlArgs = urlArgs;
    if (method == "POST") {
      if (body instanceof Blob || typeof body === "string") {
        this.rawBody = body;
        this.postRaw = true;
      } else {
        this.bodyArgs = body;
        this.postRaw = false;
      }
    } else {
      if (body) {
        console.error("body:", body);
        throw new Error(`GET api call ${path} shouldn't have a body`);
      }
    }
    setTimeout(() => {
      this.send();
    }, 0);
  }

  private send() {
    if (this.mockResult) {
      setTimeout(() => {
        console.warn("[mock] mock api result for api call:", this.path, this);
        if (this.onSuccess) {
          this.onSuccess(this.mockResult);
        }
        if (this.onAlways) {
          this.onAlways();
        }
      }, this.mockDelay); //sim network latency for a little bit
      return;
    }
    if (this.method === "GET") {
      this.sendGet();
    } else {
      this.sendPost();
    }
  }

  private getAuthHeaders(): { [key: string]: string } {
    return null;
  }

  private getPath(): string {
    return "";
  }

  private async sendGet() {
    let path = this.getPath();
    let headers = this.getAuthHeaders();
    for (let key in this.headers) {
      headers[key] = this.headers[key];
    }
    try {
      let res = await axios.request({
        baseURL: configs.apiHost,
        url: path,
        method: this.method,
        headers,
        params: this.urlArgs
      });
      this.handleRes(true, res.status as HTTPStatusCode, res);
    } catch (err) {
      this.handleRes(false, err);
    }
  }
  private async sendPost() {
    let path = this.getPath();
    let data: string;
    console.log(data);
    let headers = this.getAuthHeaders();
    for (let key in this.headers) {
      headers[key] = this.headers[key];
    }
    if (this.postRaw) {
      let url = utils.genApiUrl(path, utils.underlize(this.urlArgs));
      this.postRawBody(url, headers);
    } else {
      headers["Content-Type"] = "application/json";
      try {
        let res = await axios.request({
          baseURL: configs.apiHost,
          url: path,
          headers,
          data: this.bodyArgs,
          params: this.urlArgs
        });
        this.handleRes(true, res.status as HTTPStatusCode, res);
      } catch (err) {
        this.handleRes(false, err);
      }
    }
  }

  private postRawBody(url: string, headers: HttpProxy<Result>["headers"]) {
    let xhr = new XMLHttpRequest();
    xhr.onload = () => {
      let data = xhr.response;
      this.handleRes(true, xhr.status as HTTPStatusCode, data);
    };
    xhr.onerror = () => {
      this.handleRes(false, xhr.status as HTTPStatusCode);
    };
    xhr.open("POST", url, true);
    for (let key in headers) {
      let value = headers[key];
      xhr.setRequestHeader(key, value);
    }
    xhr.send(this.rawBody);
  }

  private handleRes(
    reqSuccess: boolean,
    httpStatusCode: HTTPStatusCode,
    data?: object | string
  ) {
    let preventCamelize = false;
    let parsedData: Result & ApiBaseResult;
    if (HttpProxy.mockError) {
      reqSuccess = false;
      httpStatusCode = 509 as any;
    }
    if (!reqSuccess) {
      // reqSuccess 为 false 说明 http 请求本身失败
      console.error(
        "HTTP Error " + httpStatusCode + " for api call: " + this.path
      );
      let skipDefault = false;
      if (this.onFail) {
        let ans = this.onFail(httpStatusCode);
        if (ans === true) {
          skipDefault = true;
        }
      }
      if (this.onFailOrError) {
        let ans = this.onFailOrError(httpStatusCode);
        if (ans === true) {
          skipDefault = true;
        }
      }
      if (!skipDefault && !this.defaultPrevented) {
        HttpProxy.commonErrorHandler(this, null, httpStatusCode, this.silent);
      }
    } else {
      // reqSuccess 为 true 说明 http 请求本身成功，需要进一步判断返回值
      let objData: object;
      if (typeof data === "string") {
        try {
          objData = JSON.parse(data);
        } catch (error) {
          console.log(this);
          console.error("parse api res error");
          console.log({ apiResData: data });
          console.error(error);
          objData = {
            success: false,
            statusCode: 0,
            statusMessage: "无法解析请求返回值"
          };
        }
      } else {
        objData = data;
      }
      if (!preventCamelize) {
        parsedData = utils.camelize(objData) as any;
      } else {
        parsedData = objData as any;
        parsedData.statusCode = (data as any)["status_code"];
        parsedData.statusMessage = (data as any)["status_message"];
      }
      if (parsedData.success) {
        if (this.onSuccess) {
          if (this.resultFilter) {
            try {
              parsedData = utils.merge(
                this.resultFilter(parsedData),
                BASE_SUCCESS_RESULT
              );
            } catch (error) {
              console.error(
                "Api resultFilter throwed an Error, api path:" + this.path
              );
              throw error;
            }
          }
          try {
            this.onSuccess(parsedData);
          } catch (error) {
            console.error("Api Success Callback Error for " + this.path);
            throw error;
          }
        }
      } else {
        console.error("got error for api call", this.path);
        console.error(parsedData.statusCode, parsedData.statusMessage, {
          httpProxy: this
        });
        let skipDefault = false;
        if (this.onError) {
          let ans = this.onError(
            parsedData.statusMessage,
            parsedData.statusCode,
            parsedData
          );
          if (ans === true) {
            skipDefault = true;
          }
        }
        if (this.onFailOrError) {
          let ans = this.onFailOrError(
            httpStatusCode,
            parsedData.statusMessage,
            parsedData.statusCode,
            parsedData
          );
          if (ans === true) {
            skipDefault = true;
          }
        }
        if (!skipDefault && !this.defaultPrevented) {
          HttpProxy.commonErrorHandler(this, parsedData, 200, this.silent);
        }
      }
    }
    if (this.onAlways) {
      return this.onAlways();
    }
  }
  /**
   * 设置api成功回调
   * @param callback 成功回调
   */
  success(callback: (result: Result & ApiBaseResult) => true | void): this {
    this.onSuccess = callback;
    return this;
  }

  /**
   * 设置 api 失败回调，会在 http 请求不成功时触发
   * @param callback 失败回调，若返回 true 则会阻止默认的 alert 行为
   */
  fail(callback: (httpStatusCode: HTTPStatusCode) => true | void): this {
    this.onFail = callback;
    return this;
  }

  /**
   * 设置 api 错误回调，会在 http 请求成功，但是响应结果中 success 字段为 false 时触发
   * @param callback 错误回调，若返回true则会阻止默认的alert行为
   */
  error(
    callback: (msg: string, statusCode: number, data?: any) => true | void
  ): this {
    this.onError = callback;
    return this;
  }

  /**
   * 设置 api 失败或错误回调，会在 http 请求失败或者响应结果中 success 字段为 false 时触发
   * @param callback 错误或失败回调，若返回true则会阻止默认的alert行为
   */
  failOrError(
    callback: (
      httpStatusCode: HTTPStatusCode,
      msg?: string,
      statusCode?: number,
      data?: any
    ) => true | void
  ): this {
    this.onFailOrError = callback;
    return this;
  }

  /**
   * 设置 api 结束回调，不论 api 成功或失败，都会调用此回调。适用场景是一些不需关心 api 本身是否失败的场景（比如按钮解锁）
   * @param callback 回调函数。函数没有参数，如果需要参数，应当使用其他的方法
   */
  always(callback: () => void): this {
    this.onAlways = callback;
    return this;
  }

  /**
   * 阻止api结果处理环节中的默认操作（比如弹出默认的alert提示）
   */
  preventDefault(): this {
    this.defaultPrevented = true;
    return this;
  }

  /**
   * 设置请求 header
   * @param name 名称
   * @param value 值
   */
  setHeader(name: string, value: string): this {
    this.headers[name] = value;
    return this;
  }

  /**
   * 为 api 调用设置虚拟返回值，用于方便调试
   * @param data 虚拟返回值 必须和标准的返回值是同一格式
   */
  mock(data: Result, mockDelay: number = 300): this {
    this.mockResult = utils.merge(data, BASE_SUCCESS_RESULT);
    this.mockDelay = mockDelay;
    return this;
  }

  /** 为 api 设置结果过滤器，只会在 api 调用成功时生效*/
  addResultFilter<ServerResData>(filter: (res: ServerResData) => Result) {
    this.resultFilter = filter;
    return this;
  }

  /**
   * 禁用任何形式的 api 报错提示，但是保留通用错误处理（比如针对认证错误的处理）
   * 大部分情况下推荐使用此方法而不是 .preventDefault()
   */
  markSilent() {
    this.silent = true;
    return this;
  }
}

export default HttpProxy;
