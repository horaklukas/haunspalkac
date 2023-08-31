import { orderBy, snakeCase } from "lodash";
import * as cheerio from "cheerio";
import { isAfter } from "date-fns";
import NodeCache from "node-cache";

import { MINUTE } from "../constants";
import { psmfPaths } from "./config";
import psmf from "./api";
import { getTeamMatches } from "./matches";
import { getPageTableData, getText, leaguePathFromTeamPage } from "./utils";

const scrappedDataCache = new NodeCache();

export interface TeamFormData {
  id: string;
  href?: string;
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

const searchTeamPath = async (teamName: string) => {
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

export const getTeamPagePath = async (teamName: string) => {
  const cacheKey = `teams.${snakeCase(teamName)}`;
  let teamPagePath = scrappedDataCache.get<string>(cacheKey);

  if (!teamPagePath) {
    teamPagePath = await searchTeamPath(teamName);

    scrappedDataCache.set(cacheKey, teamPagePath, 24 * 60 * MINUTE);
  }

  return teamPagePath;
};

const getCurrentSeason = async () => {
  const response = await psmf.get(psmfPaths.seasons);

  if (response.status >= 300) {
    throw new Error("Couldn't get list of seasons");
  }

  const $ = cheerio.load(await response.text());

  return $(".is-opened a.is-active").attr("href");
};

const getLeagues = async () => {
  const currentYearLink = await getCurrentSeason();

  if (!currentYearLink) {
    throw new Error("Couldn't get current season");
  }

  const response = await psmf.get(currentYearLink);

  if (!response.ok) {
    throw new Error("Couldn't get current season leagues");
  }

  const $ = cheerio.load(await response.text());

  return $(".component__list-label")
    .map((_: number, label: cheerio.Element) => {
      const level = getText(label, $);

      return $(label)
        .next(".component__list-links")
        .find("a")
        .map((_: number, link: cheerio.Element) => ({
          name: `${level} ${getText(link, $)}`,
          path: $(link).attr("href"),
        }))
        .toArray();
    })
    .toArray()
    .flat();
};

export type TeamDataMap = Map<string, TeamFormData>;

export const getTeams = async (): Promise<TeamDataMap> => {
  let teams = scrappedDataCache.get<TeamDataMap>("teams");

  if (!teams) {
    const leaguesLinks = await getLeagues();

    const response = await Promise.allSettled(
      leaguesLinks.map(async ({ name, path }) => {
        if (!path) {
          throw new Error(`Couldn't get league ${name} path`);
        }

        const response = await psmf.get(path);

        if (!response.ok) {
          throw new Error("Failed to get league teams");
        }

        return await response.text();
      })
    );

    teams = new Map<string, TeamFormData>();
    const teamsList = response
      .filter(({ status }) => status === "fulfilled")
      .forEach(({ value }) => {
        const $ = cheerio.load(value);
        const $teams = $('.component__title:contains("Tabulky")')
          .next(".ci-tables")
          .find("td a");

        $teams.each((index: number, link: cheerio.Element) => {
          const href = $(link).attr("href");
          const id = href?.split("/").filter(Boolean).at(-1) ?? `${index}`;

          teams!.set(id, {
            id,
            href,
            label: getText(link, $),
          });
        });
      });
  }

  return teams;
};

export const getTeamName = async (teamId: string) => {
  const teams = await getTeams();

  const team = teams.find(({ id }) => id === teamId);

  return team?.label ?? null;
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
