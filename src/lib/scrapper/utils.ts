import * as cheerio from "cheerio";

export const getText = (element: cheerio.Element | string, $: cheerio.CheerioAPI) =>
  $(element).text().trim();

export const getPageTableData = ($: cheerio.CheerioAPI) => {
  const data = [];

  $(".main-content table tr").each((_: number, row: cheerio.Element) => {
    const columns = $(row).find("td");

    if (columns.length > 0) {
      data.push(columns);
    }
  });

  return data;
};

export const leaguePathFromTeamPage = (teamPagePath: string) =>
  teamPagePath.substr(0, teamPagePath.indexOf("tymy/"));
