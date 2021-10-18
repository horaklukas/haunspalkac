export const PSMF_URL = "http://www.psmf.cz";

export const psmfPaths = {
  fields: "vyveska/seznam-hrist/",
  search: "vyhledavani",
  matchSchedule: (teamPagePath) => `${teamPagePath}rozpis-zapasu`,
  teamsScript: "res/js/search.js",
};

export const useMockApi = false;
