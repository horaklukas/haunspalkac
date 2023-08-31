export const PSMF_URL = "http://www.psmf.cz";

export const psmfPaths = {
  seasons: 'souteze/',
  fields: "vyveska/seznam-hrist/",
  search: "vyhledavani",
  matchSchedule: (teamPagePath: string) => `${teamPagePath}rozpis-zapasu`,
  currentTable: (leaguePagePath: string) => `${leaguePagePath}prubezna-tabulka`,
  teamsScript: "res/js/search.js",
} as const;

export const useMockApi = false;
