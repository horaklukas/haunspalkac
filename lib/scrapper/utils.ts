export const getText = (element: cheerio.Element, $: any) =>
  $(element).text().trim();
