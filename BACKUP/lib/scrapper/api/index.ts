import axios from "axios";

import mockClient from "./mock/client";
import { PSMF_URL, useMockApi } from "../config";

const psmfClient = axios.create({
  baseURL: PSMF_URL,
});

const psmf = {
  get: (path: string, params?: any) => {
    const client = useMockApi ? mockClient : psmfClient;

    return client.get(path, params);
  },
};

export default psmf;
