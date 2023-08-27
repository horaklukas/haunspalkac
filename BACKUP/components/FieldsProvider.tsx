import { createContext, useContext } from "react";
import type { FieldsById } from "lib/scrapper";

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
