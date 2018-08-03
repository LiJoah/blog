import { HttpProxy } from "./httpProxy";
// import { utils } from "../helpers/utils";

type APIQueryArgCollection = ApiTypes.APIQueryArgCollection;
type APIBodyArgCollection = ApiTypes.APIBodyArgCollection;
// type ApiBaseResult = ApiTypes.ApiBaseResult;

export namespace api {
  export const AUTH_ERROR_CODES = HttpProxy.AUTH_ERROR_CODES;

  function get<T = {}>(
    path: string,
    urlArgs?: APIQueryArgCollection
  ): HttpProxy<T> {
    return new HttpProxy<T>("GET", path, urlArgs);
  }

  function post<T = {}>(
    path: string,
    urlArgs?: APIQueryArgCollection,
    bodyArgs?: APIBodyArgCollection
  ): HttpProxy<T> {
    return new HttpProxy<T>("POST", path, urlArgs, bodyArgs);
  }

  export function postBinary<T = {}>(
    path: string,
    urlArgs: APIQueryArgCollection,
    binary: Blob | string
  ): HttpProxy<T> {
    //TODO post binary was not fully supported yet! it can't be called from front end!
    return new HttpProxy<T>("POST", path, urlArgs, binary);
  }
}

export default api;
