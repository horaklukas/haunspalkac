import cheerio from "cheerio";
import { getText, psmf } from "./utils";
import { trim } from "lodash";

export interface FieldData {
  abbr: string;
  name: string;
  info: string;
}

// TODO - get also field link
const parseFieldData = (firstColumnText: string): { abbr: string }[] => {
  const [fieldId, ...crumbs] = firstColumnText.split(/\s/g);

  if (crumbs.length === 0) {
    return [{ abbr: fieldId }];
  } else {
    const fieldNumbers = crumbs
      .map((crumb: string) => {
        const maybeNumber = trim(crumb, ", ");
        return maybeNumber === "" ? NaN : Number(maybeNumber);
      })
      .filter((maybeFieldNumber: number) => !isNaN(maybeFieldNumber));

    if (fieldNumbers.length === 0) {
      return [{ abbr: fieldId }];
    } else {
      return fieldNumbers.map((fieldNumber: number) => ({
        abbr: `${fieldId}${fieldNumber}`,
      }));
    }
  }
};

export const getFieldsList = async (): Promise<FieldData[]> => {
  const response = await psmf.get("vyveska/seznam-hrist/");

  const html = response.data;
  const $ = cheerio.load(html);

  const allFields: FieldData[] = [];

  $(".main-content table tr").each((_: number, row: cheerio.Element) => {
    const columns = $(row).find("td");
    const firstColumnText = getText(columns[0], $);

    // headers are not in th but td elements, we need to identify it by label :( skip headers
    if (firstColumnText === "Zkratka hřiště") {
      return;
    }

    try {
      const fields = parseFieldData(firstColumnText);

      fields.forEach(({ abbr }) => {
        const name = getText(columns[1], $);
        const info = getText(columns[2], $);

        allFields.push({
          abbr,
          name,
          info,
        });
      });
    } catch (e) {
      // TODO - handle errors
    }
  });

  return allFields;
};
