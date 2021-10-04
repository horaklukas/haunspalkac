import axios from "axios";
import cheerio from "cheerio";

export const psmf = axios.create({
  baseURL: "http://www.psmf.cz",
});

export const getText = (element: cheerio.Element, $: any) => $(element).text().trim();
