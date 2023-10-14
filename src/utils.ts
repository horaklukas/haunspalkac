import { formatInTimeZone } from "date-fns-tz";
import { cs, enUS } from "date-fns/locale";

import { getFullPsmfUrl } from "./lib/scrapper/utils";

const dateLocales = {
  cs,
  en: enUS,
};

export const getTeamUrl = (urlPath?: string) =>
  urlPath ? getFullPsmfUrl(urlPath).toString() : "";

export const formatMatchTime = (
  date: Date,
  format = "HH:mm",
  locale?: keyof typeof dateLocales
) => {
  const options = locale ? { locale: dateLocales[locale] } : undefined;
  
  return formatInTimeZone(date, "Europe/Prague", format, options);
};
