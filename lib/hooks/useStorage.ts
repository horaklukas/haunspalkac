import { useLocalStorage } from "usehooks-ts";

import { PROJECT_NAME } from "lib/constants";

export interface Data {
  team: {
    id: null | string;
  };
}

export const initialState: Data = {
  team: { id: null },
};

export const useStorage = () => {
  const [data, set] = useLocalStorage<Data>(PROJECT_NAME, initialState);

  const reset = () => set(initialState);

  return {
    data,
    set,
    reset,
  };
};
