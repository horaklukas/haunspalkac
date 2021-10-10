import axios from "axios";

import mockClient from "./mockClient";
import { useMockApi } from "../config";

const psmfClient = axios.create({
  baseURL: "http://www.psmf.cz",
});

const psmf = {
  get: (path: string, params?: any) => {
    const client = useMockApi ? mockClient : psmfClient;

    return client.get(path, params);
  },
};

export default psmf;
