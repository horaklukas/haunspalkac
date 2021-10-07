import { psmf } from "./utils";

type TeamSearchData = any;

interface TeamFormData {
  id: string;
  label: string;
}

function parseData<Item extends any>(
  dataScript: string,
  dataName: string
): Item[] {
  const dataJson = dataScript.replace(`var ${dataName}JsonData =`, "").trim();

  return JSON.parse(dataJson);
}

export const getTeamSuggestions = async (): Promise<TeamSearchData[]> => {
  const response = await psmf.get("res/js/search.js");

  // Note: Script contains `searchJsonData` and `formJsonData` variables.
  const [_, formDataScript] = response.data.split(";");
  const formData = parseData<TeamFormData>(formDataScript, "form");

  // TODO - handle errors

  return formData;
};
