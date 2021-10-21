import { orderBy } from "lodash";
import cheerio from "cheerio";
import { isAfter } from "date-fns";

import { psmfPaths } from "./config";
import psmf from "./api";
import { getTeamMatches } from "./matches";
import { getPageTableData, getText, leaguePathFromTeamPage } from "./utils";

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

export const getTeamPagePath = async (teamName: string) => {
  const response = await psmf.get(psmfPaths.search, {
    params: {
      query: teamName,
    },
  });

  const html = response.data;
  const $ = cheerio.load(html);

  const teamTitle = $(`h2`).filter(
    (_: number, title: cheerio.Element) =>
      $(title).text().trim() === `Tým ${teamName}`
  );

  if (teamTitle.length) {
    return response.request.path;
  }

  const link = $(".main-content a").filter(
    (_: number, link: cheerio.Element) => {
      const href = $(link).attr("href");
      return href !== undefined && href.includes("hanspaulska-liga");
    }
  );

  if (link.length === 1) {
    return $(link).attr("href");
  }

  throw new Error("Coulnd't get team page path");
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

export const getLeagueTeamsStatistics = async (
  teamId: string
): Promise<TeamStatistic[]> => {
  const team = await getTeamName(teamId);
  const teamPagePath = await getTeamPagePath(team);
  const leaguePagePath = leaguePathFromTeamPage(teamPagePath);

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

export const getTeamData = async (teamId: string) => {
  const team = await getTeamName(teamId);

  const path = await getTeamPagePath(team);
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
