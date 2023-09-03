import mockClient from "./mock/client";
import {  useMockApi } from "../config";
import { getFullPsmfUrl } from "../utils";

const psmfClient = {
  get(path: string, params?: RequestInit) {
    return fetch(getFullPsmfUrl(path), params);
  },
};

const psmf = {
  get: (path: string, params?: any) => {
    // const client = useMockApi ? mockClient : psmfClient;
    const client = psmfClient;

    return client.get(path, params);
  },
};

export default psmf;
