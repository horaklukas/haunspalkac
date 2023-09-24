import NodeCache from "node-cache";
import * as cheerio from "cheerio";
import { getPageTableData, getText } from "./utils";
import psmf from "./api";
import { trim } from "lodash";
import { psmfPaths } from "./config";
import { logger } from "../logger";
import { MINUTE } from "../constants";

const scrappedDataCache = new NodeCache();

export interface FieldData {
  abbr: string;
  name: string;
  link?: string;
  info: string;
  address: string;
}

const parseFieldInfo = (
  infoColumn: cheerio.Element,
  $: cheerio.CheerioAPI
): Pick<FieldData, "address" | "info"> => {
  const firstColumnText = $(infoColumn).html() ?? "";
  const [address, ...crumbs] = firstColumnText.split("<br>");

  return {
    address,
    info: crumbs.join("\n"),
  };
};

export const getFieldsList = async (): Promise<FieldData[]> => {
  const cacheKey = `fields`;
  let fields = scrappedDataCache.get<FieldData[]>(cacheKey);

  if (!fields) {
    const fieldsScrapProfiler = logger.startTimer();

    const response = await psmf.get(psmfPaths.fields);

    if (!response.ok) {
      throw new Error("Couldn't get fields page");
    }

    fieldsScrapProfiler.done({ message: "Fields scrapped" });

    const fieldsParseProfiler = logger.startTimer();

    const html = await response.text();
    const $ = cheerio.load(html);

    fields = [] as FieldData[];

    fields = getPageTableData($("table.cms-editor-table"), $).flatMap(
      (columns) => {
        const name = getText(columns[0], $);
        const { address, info } = parseFieldInfo(columns[2], $);

        return $(columns[1])
          .find("a")
          .map((_: number, linkElement: cheerio.Element) => {
            const link = $(linkElement).attr("href");
            const abbr = getText(linkElement, $);

            return { abbr, name, info, address, link };
          })
          .toArray();
      }
    );

    scrappedDataCache.set(cacheKey, fields, 24 * 60 * MINUTE);

    fieldsParseProfiler.done({ message: `Fields parsed` });
  }
  // console.log(fields)
  return fields;
};

export const getFieldsById = async () => {
  const fields = await getFieldsList();

  const fieldsMap = new Map<FieldData["abbr"], FieldData>();

  fields.forEach((field) => {
    fieldsMap.set(field.abbr, field);
  });

  return fieldsMap;
};
