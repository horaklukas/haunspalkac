import { orderBy } from "lodash";
import cheerio from "cheerio";
import { isAfter } from "date-fns";

import { psmfPaths } from "./config";
import psmf from "./api";
import { getMatchesPagePath, getTeamMatches } from "./matches";
import { getPageTableData, getText } from "./utils";

type TeamSearchData = string;

export interface TeamFormData {
  id: string;
  label: string;
}

export interface TeamStatistic {
  order: number;
  name: string;
  matches: number;
  wins: number;
  draws: number;
  loses: number;
  score: string;
  points: number;
}

export const getTeamsStatistics = async (
  leaguePagePath: string
): Promise<TeamStatistic[]> => {
  const response = await psmf.get(psmfPaths.currentTable(leaguePagePath));

  const html = response.data;
  const $ = cheerio.load(html);

  return getPageTableData($).map((columns) => {
    const order = getText(columns[0], $);

    return {
      order: Number(order.substr(0, order.length - 1)),
      name: getText(columns[1], $),
      matches: Number(getText(columns[2], $)),
      wins: Number(getText(columns[3], $)),
      draws: Number(getText(columns[4], $)),
      loses: Number(getText(columns[5], $)),
      score: getText(columns[6], $),
      points: Number(getText(columns[7], $)),
    };
  });
};

function parseScriptData<Item extends any>(
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
  const formData = parseScriptData<TeamFormData>(formDataScript, "form");

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
