import mockClient from "./mock/client";
import { PSMF_URL, useMockApi } from "../config";

const psmfClient = {
  get(path: string, params?: RequestInit) {
    const url = new URL(path, PSMF_URL);

    return fetch(url, params);
  },
};

const psmf = {
  get: (path: string, params?: any) => {
    const client = useMockApi ? mockClient : psmfClient;

    return client.get(path, params);
  },
};

export default psmf;
