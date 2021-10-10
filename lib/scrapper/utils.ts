import cheerio from "cheerio";

export const getText = (element: cheerio.Element, $: cheerio.Root) =>
  $(element).text().trim();
