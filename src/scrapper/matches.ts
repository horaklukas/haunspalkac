import cheerio from "cheerio";
import * as dateFns from "date-fns";
import { cs } from "date-fns/locale";

import { psmf, getText } from "./utils";

export const getMatchesPagePath = async (teamName: string) => {
  const response = await psmf.get("vyhledavani", {
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

export const getTeamMatches = async (teamPagePath: string) => {
  const response = await psmf.get(`${teamPagePath}rozpis-zapasu`);

  const html = response.data;
  const $ = cheerio.load(html);

  const matches: {
    teams: { home: string; away: string };
    date: Date;
    field: string;
  }[] = [];

  $(".main-content table tr").each((_: number, row: cheerio.Element) => {
    const columns = $(row).find("td");

    if (columns.length === 0) {
      return;
    }

    const [home, away] = $(columns[0]).text().split("–");

    const year = 2021;

    const time = getText(columns[2], $);
    const [hour, minute] = time.split(":");

    const day = getText(columns[1], $);

    const parsedDate: Date = dateFns.parse(day, "EEEEEE d.M.", new Date(), {
      locale: cs,
    });

    const matchDate = new Date(
      year,
      parsedDate.getMonth(),
      parsedDate.getDate(),
      hour,
      minute
    );

    matches.push({
      teams: {
        home: home?.trim(),
        away: away?.trim(),
      },
      date: matchDate,
      field: getText(columns[3], $),
    });
  });

  return matches;
};
