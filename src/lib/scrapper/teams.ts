import { snakeCase } from "lodash";
import * as cheerio from "cheerio";
import NodeCache from "node-cache";

import { MINUTE } from "../constants";
import { psmfPaths } from "./config";
import psmf from "./api";
import { getTeamMatches } from "./matches";
import { getTeamIdFromPath, getText } from "./utils";
import { logger } from "../logger";

const scrappedDataCache = new NodeCache();

export interface TeamInfo {
  id: string;
  urlPath?: string;
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

const getCurrentSeason = async () => {
  const response = await psmf.get(psmfPaths.seasons);

  if (!response.ok) {
    throw new Error("Couldn't get list of seasons");
  }

  const $ = cheerio.load(await response.text());

  return $(".is-opened a.is-active").attr("href");
};

const getLeagues = async () => {
  logger.info("Going to scrap leagues list");
  const leaguesScrapProfiler = logger.startTimer();

  const currentYearLink = await getCurrentSeason();

  if (!currentYearLink) {
    throw new Error("Couldn't get current season");
  }

  const response = await psmf.get(currentYearLink);

  if (!response.ok) {
    throw new Error("Couldn't get current season leagues");
  }

  leaguesScrapProfiler.done({ message: "Leagues list scrapped" });

  const leaguesParseProfiler = logger.startTimer();

  const $ = cheerio.load(await response.text());

  const leagues = $(".component__list-label")
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

  leaguesParseProfiler.done({
    message: `${leagues.length} leagues list parsed`,
  });

  return leagues;
};

export type TeamDataMap = Map<string, TeamInfo>;

export const getTeams = async (): Promise<TeamDataMap> => {
  let teams = scrappedDataCache.get<TeamDataMap>("teams");

  if (!teams) {
    logger.info("Teams not found in cache, going to scrap them");
    const leaguesLinks = await getLeagues();

    const teamsScrapProfiler = logger.startTimer();

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

    teamsScrapProfiler.done({
      message: "Leagues pages (containing teams) scrapped",
    });

    teams = new Map<string, TeamInfo>();

    const teamsParseProfiler = logger.startTimer();

    for (const leaguePagePromise of response) {
      if (leaguePagePromise.status !== "fulfilled") {
        continue;
      }

      const $ = cheerio.load(leaguePagePromise.value);
      const $teams = $('.component__title:contains("Tabulky")')
        .next(".ci-tables")
        .find("td a");

      $teams.each((index: number, link: cheerio.Element) => {
        const href = $(link).attr("href");
        const id = getTeamIdFromPath(href) ?? `${index}`;

        teams!.set(id, {
          id,
          urlPath: href,
          label: getText(link, $),
        });
      });
    }
    teamsParseProfiler.done({ message: "Teams parsed from leagues pages" });
  }

  return teams;
};

export const getTeamData = async (teamId: string) => {
  const teams = await getTeams();

  const team = teams.get(teamId);

  if (!team || !team.urlPath) {
    return null;
  }

  const { urlPath } = team;
  const matches = await getTeamMatches(urlPath);

  return {
    team,
    matches,
  };
};
