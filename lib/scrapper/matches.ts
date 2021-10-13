import cheerio from "cheerio";
import * as dateFns from "date-fns";
import { cs } from "date-fns/locale";
import { zonedTimeToUtc } from "date-fns-tz";

import { getText } from "./utils";
import psmf from "./api";
import { psmfPaths } from "./config";

export interface MatchData {
  teams: { home: string; away: string };
  date: string;
  field: string;
}

export type MatchSchedule = MatchData[];

export const getMatchesPagePath = async (teamName: string) => {
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

  throw new Error("Coulnd't get team matches path");
};

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

  const matches: MatchData[] = [];

  $(".main-content table tr").each((_: number, row: cheerio.Element) => {
    const columns = $(row).find("td");

    if (columns.length === 0) {
      return;
    }

    const [home, away] = $(columns[0]).text().split("–");

    const matchDate = getMatchDate(columns[2], columns[1], year, $);

    matches.push({
      teams: {
        home: home?.trim(),
        away: away?.trim(),
      },
      date: matchDate.toISOString(),
      field: getText(columns[3], $),
    });
  });

  return matches;
};
