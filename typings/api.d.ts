declare namespace ApiTypes {
  /** 只声明 http 的三位数状态码，我们的状态码不要写这里 */
  type HTTPStatusCode = 0 | 200 | 404 | 403 | 500;

  interface APIQueryArgCollection {
    [name: string]: number | string | boolean;
  }

  interface APIBodyArgCollection {
    [name: string]: any;
  }

  interface ApiBaseResult {
    success: boolean,
    statusCode: number,
    statusMessage: string
  }
}

declare namespace PostDataTypes {
}
