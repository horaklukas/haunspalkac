import { createContext, useContext } from "react";
import type { FieldData } from "../lib/scrapper";

export type FieldsById = Record<string, FieldData>;

const FieldsContext = createContext<FieldsById>({});

export const FieldsProvider = FieldsContext.Provider;

export const useFields = () => {
  const fieldsById = useContext(FieldsContext);

  return fieldsById;
};

export const useField = (fieldId) => {
  const fields = useFields();
  return fields[fieldId];
};
