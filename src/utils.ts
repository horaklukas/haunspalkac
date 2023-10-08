import { getFullPsmfUrl } from "./lib/scrapper/utils";

export const getTeamUrl = (urlPath?: string) => urlPath ? getFullPsmfUrl(urlPath).toString() : ''
