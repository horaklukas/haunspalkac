import cheerio from "cheerio";
import * as dateFns from "date-fns";
import { cs } from "date-fns/locale";
import { zonedTimeToUtc } from "date-fns-tz";

import { getPageTableData, getText } from "./utils";
import psmf from "./api";
import { psmfPaths } from "./config";

export interface MatchData {
  teams: { home: string; away: string };
  date: string;
  field: string;
}

export type MatchSchedule = MatchData[];

const getMatchDate = (
  timeColumn: cheerio.Element,
  dateColumn: cheerio.Element,
  year: number,
  $: cheerio.Root
) => {
  const time = getText(timeColumn, $);
  const [hour, minute] = time.split(":");

  const day = getText(dateColumn, $);

  const date: Date = dateFns.parse(day, "EEEEEE d.M.", new Date(), {
    locale: cs,
  });

  date.setFullYear(year);
  date.setHours(Number(hour));
  date.setMinutes(Number(minute));

  return zonedTimeToUtc(date, "Europe/Prague");
};

export const getTeamMatches = async (
  teamPagePath: string
): Promise<MatchSchedule> => {
  const response = await psmf.get(psmfPaths.matchSchedule(teamPagePath));

  const html = response.data;
  const $ = cheerio.load(html);

  const titleText = getText("h1", $);
  const [parsedYear] = titleText.match(/\d{4}/) ?? [];
  // fallback to current year if there is some issue about parsing the year
  const year = parsedYear ? Number(parsedYear) : new Date().getFullYear();

  return getPageTableData($).map((columns) => {
    const [home, away] = $(columns[0]).text().split("–");

    const matchDate = getMatchDate(columns[2], columns[1], year, $);

    return {
      teams: {
        home: home?.trim(),
        away: away?.trim(),
      },
      date: matchDate.toISOString(),
      field: getText(columns[3], $),
    };
  });
};
