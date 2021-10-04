// @ts-ignore
const axios = require("axios");
const cheerio = require("cheerio");
const dateFns = require("date-fns");
const { cs } = require("date-fns/locale");
const { trim } = require("lodash");

// @ts-ignore
const { psmf, getText } = require("./utils");
// @ts-ignore
const { getFieldsList } = require("./fields");

const getMatchesPagePath = async (teamName: string) => {
  const response = await psmf.get("/vyhledavani", {
    params: {
      query: teamName,
    },
  });

  const html = response.data;
  const $ = cheerio.load(html);

  const teamTitle = $(`h2`).filter(
    (_: number, title: HTMLElement) =>
      $(title).text().trim() === `Tým ${teamName}`
  );

  if (teamTitle.length) {
    return response.request.path;
  }

  const link = $(".main-content a").filter(
    (_: number, link: HTMLAnchorElement) => {
      const href = $(link).attr("href");
      return href.includes("hanspaulska-liga");
    }
  );

  if (link.length === 1) {
    return $(link).attr("href");
  }

  throw new Error("Coulnd't get team matches path");
};

const getTeamMatches = async (teamPagePath: string) => {
  const response = await psmf.get(`${teamPagePath}rozpis-zapasu`);

  const html = response.data;
  const $ = cheerio.load(html);

  const matches: {
    teams: { home: string; away: string };
    date: Date;
    field: string;
  }[] = [];

  $(".main-content table tr").each((_: number, row: HTMLTableRowElement) => {
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

const main = async () => {
  try {
    const fields = await getFieldsList();
    console.log({ fields });
    // const team = "Viktoria Bítovská A";
    const team = "Pražská eS";
    const path = await getMatchesPagePath(team);
    const titles = await getTeamMatches(path);

    // console.log(titles);
  } catch (error) {
    console.error(error);
  }
};

main();
