import cheerio from "cheerio";
import { getPageTableData, getText } from "./utils";
import psmf from "./api";
import { trim } from "lodash";
import { psmfPaths } from "./config";

export interface FieldData {
  abbr: string;
  name: string;
  info: string;
  link: string;
}

const parseFieldData = (
  firstColumn: cheerio.Element,
  $: cheerio.Root
): Pick<FieldData, "abbr" | "link">[] => {
  const firstColumnText = getText(firstColumn, $);

  // headers are not in th but td elements, we need to identify them by label :( and then skip them
  if (firstColumnText === "Zkratka hřiště") {
    return null;
  }

  const [fieldId, ...crumbs] = firstColumnText.split(/\s/g);

  const links: string[] = [];
  $(firstColumn)
    .find("a")
    .each((_: number, linkElement: cheerio.Element) => {
      const link = $(linkElement).attr("href");

      if (/^https?:\/\/mapy\.cz/.test(link)) {
        links.push(link);
      }
    });
  const firstLink = links[0] ?? null;

  if (crumbs.length === 0) {
    return [{ abbr: fieldId, link: firstLink }];
  } else {
    const fieldNumbers = crumbs
      .map((crumb: string) => {
        const maybeNumber = trim(crumb, ", ");
        return maybeNumber === "" ? NaN : Number(maybeNumber);
      })
      .filter((maybeFieldNumber: number) => !isNaN(maybeFieldNumber));

    if (fieldNumbers.length === 0) {
      return [{ abbr: fieldId, link: firstLink }];
    } else {
      return fieldNumbers.map((fieldNumber: number, index: number) => {
        const link = links[index] ?? firstLink;

        return {
          abbr: `${fieldId}${fieldNumber}`,
          link: link,
        };
      });
    }
  }
};

export const getFieldsList = async (): Promise<FieldData[]> => {
  const response = await psmf.get(psmfPaths.fields);

  const html = response.data;
  const $ = cheerio.load(html);

  const allFields: FieldData[] = [];

  getPageTableData($).forEach((columns) => {
    const fields = parseFieldData(columns[0], $);

    if (!fields) {
      return;
    }

    fields.forEach(({ abbr, link }) => {
      const name = getText(columns[1], $);
      const info = getText(columns[2], $);

      allFields.push({
        abbr,
        name,
        info,
        link: link,
      });
    });
  });

  return allFields;
};

export type FieldsById = Record<string, FieldData>;

export const getFieldsById = async () => {
  const fields = await getFieldsList();

  const fieldsByAbbr: FieldsById = fields.reduce((byAbbr, field) => {
    byAbbr[field.abbr] = field;
    return byAbbr;
  }, {});

  return fieldsByAbbr;
};
