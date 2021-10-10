import cheerio from "cheerio";

export const getText = (element: cheerio.Element | string, $: cheerio.Root) =>
  $(element).text().trim();
