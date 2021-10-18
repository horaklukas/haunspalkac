import { orderBy } from "lodash";
import { isAfter } from "date-fns";

import { psmfPaths } from "./config";
import psmf from "./api";
import { getMatchesPagePath, getTeamMatches } from "./matches";

type TeamSearchData = string;

export interface TeamFormData {
  id: string;
  label: string;
}

function parseData<Item extends any>(
  dataScript: string,
  dataName: string
): Item[] {
  const dataJson = dataScript.replace(`var ${dataName}JsonData =`, "").trim();

  const data = JSON.parse(dataJson);
  const sortedData = orderBy(data, ["label"], "asc");

  return sortedData;
}

export const getTeams = async (): Promise<TeamFormData[]> => {
  const response = await psmf.get(psmfPaths.teamsScript);

  // Note: Script contains `searchJsonData` and `formJsonData` variables.
  const [_, formDataScript] = response.data.split(";");
  const formData = parseData<TeamFormData>(formDataScript, "form");

  // TODO - handle errors
  // TODO - cache data

  return formData;
};

export const getTeamName = async (teamId: string) => {
  const teams = await getTeams();

  const team = teams.find(({ id }) => id === teamId);

  return team?.label ?? null;
};

export const getTeamData = async (teamId: string) => {
  const team = await getTeamName(teamId);

  const path = await getMatchesPagePath(team);
  const matches = await getTeamMatches(path);

  const nowDate = new Date();
  const schedule = matches.filter((match) =>
    isAfter(new Date(match.date), nowDate)
  );

  return {
    team,
    web: path,
    schedule,
  };
};
