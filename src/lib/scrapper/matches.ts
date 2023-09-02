import * as cheerio from "cheerio";
import * as dateFns from "date-fns";
import { cs } from "date-fns/locale";
import { zonedTimeToUtc } from "date-fns-tz";

import { getPageTableData, getTeamIdFromPath, getText } from "./utils";
import psmf from "./api";
import { psmfPaths } from "./config";

type Field = {
  label: string;
  path: string;
};

export interface MatchData {
  round: number;
  teams: { home?: string; away?: string };
  date: Date;
  field: string // Field;
}

export type MatchSchedule = MatchData[];

const getMatchDate = (
  timeColumn: cheerio.Element,
  dateColumn: cheerio.Element,
  $: cheerio.CheerioAPI
) => {
  const time = getText(timeColumn, $);
  const [hour, minute] = time.split(":");

  // First is date, we don't need it
  const [, fullDate] = getText(dateColumn, $).split(/\s/);

  const date: Date = dateFns.parse(fullDate, "d.M.yy", new Date(), {
    locale: cs,
  });

  date.setHours(Number(hour));
  date.setMinutes(Number(minute));

  return zonedTimeToUtc(date, "Europe/Prague");
};

export const getTeamMatches = async (
  teamPagePath: string
): Promise<MatchSchedule> => {
  const response = await psmf.get(teamPagePath);

  if (!response.ok) {
    throw new Error("Couldn't get team detail page");
  }

  const $ = cheerio.load(await response.text());

  return getPageTableData($("table.games-new-table"), $).map((columns) => {
    const [$home, $away] = $(columns[3]).find('a[href^="/souteze/"]').toArray();

    const home = getTeamIdFromPath($($home).attr("href"));
    const away = getTeamIdFromPath($($away).attr("href"));

    const matchDate = getMatchDate(columns[1], columns[0], $);

    return {
      teams: {
        home: home?.trim(),
        away: away?.trim(),
      },
      date: matchDate,
      field: getText(columns[2], $),
      round: Number(getText(columns[4], $).slice(0, -1)),
    };
  });
};
