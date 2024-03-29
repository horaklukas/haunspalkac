import * as cheerio from "cheerio";
import { PSMF_URL } from "./config";

export const getText = (
  element: cheerio.Element | string,
  $: cheerio.CheerioAPI
) => $(element).text().trim();

export const getPageTableData = (
  $table: cheerio.Cheerio<cheerio.Element>,
  $: cheerio.CheerioAPI
) => {
  const data: cheerio.Cheerio<cheerio.Element>[] = [];

  $("tr", $table).each((_: number, row: cheerio.Element) => {
    const columns = $(row).find("td");

    if (columns.length > 0) {
      data.push(columns);
    }
  });

  return data;
};

export const getTeamIdFromPath = (path?: string) => {
  return path?.split("/").filter(Boolean).at(-1);
};

export const getFullPsmfUrl = (path: string) => {
  return new URL(path, PSMF_URL);
};
