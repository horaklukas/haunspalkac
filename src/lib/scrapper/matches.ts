import NodeCache from "node-cache";
import * as cheerio from "cheerio";
import * as dateFns from "date-fns";
import { cs } from "date-fns/locale";
import { zonedTimeToUtc } from "date-fns-tz";

import { getPageTableData, getTeamIdFromPath, getText } from "./utils";
import psmf from "./api";
import { snakeCase } from "lodash";
import { MINUTE } from "../constants";

const scrappedDataCache = new NodeCache();

/*  mapping czech color names to english names */
const colorsMap: Record<string, string> = {
  červená: "red",
  modrá: "blue",
  zelená: "green",
  žlutá: "yellow",
  oranžová: "orange",
  růžová: "pink",
  fialová: "purple",
  hnědá: "brown",
  šedá: "gray",
  bílá: "white",
  černá: "black",
  tyrkysová: "turquoise",
  olivová: "olive",
  stříbrná: "silver",
  zlatá: "gold",
  korálová: "coral",
  malinová: "raspberry",
  limetková: "lime green",
  bežová: "beige",
  safírová: "sapphire blue",
  indigová: "indigo",
  azurová: "azure",
  kaštanová: "chestnut",
  azalková: "azalea",
  slonovinová: "ivory",
  kašová: "khaki",
  lavandová: "lavender",
  malachitová: "malachite",
  meruňková: "apricot",
  "nebesky modrá": "sky blue",
  okrová: "ochre",
  terakotová: "terracotta",
  vanilková: "vanilla",
  béžová: "beige",
  "černo-červená": "black-red",
  "červeno-černá": "red-black",
  "žluto-černá": "yellow-black",
  "modro-černá": "blue-black",
  "bílo-zelená": "white-green",
  "tmavě modrá": "darkblue",
  "světle modrá": "lightblue",
};

type Field = {
  label: string;
  path: string;
};

type MatchTeam = {
  id?: string;
  shirtColors?: string[] | null;
};

export interface MatchData {
  round: number;
  teams: { home: MatchTeam; away: MatchTeam };
  date: Date;
  field: string; // Field;
}

export type MatchSchedule = MatchData[];

const getColorFromCzName = (czColor: string) => {
  if (czColor in colorsMap) {
    return colorsMap[czColor];
  }

  console.log("Missing color", czColor);
  return "unknown";
};

const getShirtColors = (colors?: string) => {
  if (!colors) {
    return null;
  }

  const czColors = colors.split(", ");

  return czColors.flatMap((czColor) => {
    if (czColor.includes("-")) {
      const [first, secondColor] = czColor.split("-");
      // convert color name like "černo" to "černá"
      const firstColor =
        first.charAt(first.length - 1) === "o"
          ? `${first.slice(0, -1)}á`
          : first;

      return [getColorFromCzName(firstColor), getColorFromCzName(secondColor)];
    }

    return getColorFromCzName(czColor);
  });
};

const getMatchDate = (
  timeColumn: cheerio.Element,
  dateColumn: cheerio.Element,
  $: cheerio.CheerioAPI
) => {
  const time = getText(timeColumn, $);
  const [hour, minute] = time.split(":");

  // First is date, we don't need it
  const [, fullDate] = getText(dateColumn, $).split(/\s/);

  const date: Date = dateFns.parse(fullDate, "d.M.yy", new Date(), {
    locale: cs,
  });

  date.setHours(Number(hour));
  date.setMinutes(Number(minute));

  return zonedTimeToUtc(date, "Europe/Prague");
};

export const getTeamMatches = async (
  teamPagePath: string
): Promise<MatchSchedule> => {
  const cacheKey = `teams.${snakeCase(teamPagePath)}`;
  let matchSchedule = scrappedDataCache.get<MatchSchedule>(cacheKey);

  if (!matchSchedule) {
    const response = await psmf.get(teamPagePath);

    if (!response.ok) {
      throw new Error("Couldn't get team detail page");
    }

    const $ = cheerio.load(await response.text());

    matchSchedule = getPageTableData($("table.games-new-table"), $).map(
      (columns) => {
        const [$home, $away] = $(columns[3])
          .find('a[href^="/souteze/"]')
          .toArray();
        const [$shirtHome, $shirtAway] = $(columns[3])
          .find("a.component__table-shirt")
          .toArray();

        const home = getTeamIdFromPath($($home).attr("href"));
        const away = getTeamIdFromPath($($away).attr("href"));
        const shirtHome = getShirtColors($($shirtHome).attr("title"));
        const shirtAway = getShirtColors($($shirtAway).attr("title"));

        const matchDate = getMatchDate(columns[1], columns[0], $);

        return {
          teams: {
            home: { id: home?.trim(), shirtColors: shirtHome },
            away: { id: away?.trim(), shirtColors: shirtAway },
          },
          date: matchDate,
          field: getText(columns[2], $),
          round: Number(getText(columns[4], $).slice(0, -1)),
        };
      }
    );

    scrappedDataCache.set(cacheKey, matchSchedule, 24 * 60 * MINUTE);
  }

  return matchSchedule;
};
