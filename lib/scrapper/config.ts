export const PSMF_URL = "http://www.psmf.cz";

export const psmfPaths = {
  fields: "vyveska/seznam-hrist/",
  search: "vyhledavani",
  matchSchedule: (teamPagePath: string) => `${teamPagePath}rozpis-zapasu`,
  currentTable: (leaguePagePath: string) => `${leaguePagePath}prubezna-tabulka`,
  teamsScript: "res/js/search.js",
};

export const useMockApi = false;
