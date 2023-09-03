import { psmfPaths } from "../../config";

import {
  aritmaField,
  bechField,
  edenField,
  meteField,
  mikuField,
} from "../../__tests__/fields.fixtures";
import { matchesPage } from "../../__tests__/matches.fixtures";
import {
  leaguePagePath,
  leagueTablePage,
  teamPage,
  teamPagePath,
} from "../../__tests__/teams.fixtures";
import {
  createFakeResponse,
  createFakeHTMLResponse,
  delay,
  createFakeJsonScriptDataResponse,
} from "./utils";

const mockClient = {
  get: async (path: string, params?: any) => {
    if (path === psmfPaths.fields) {
      return createFakeHTMLResponse(`
          <table class="standard" cellspacing="0" cellpadding="0" width="100%">
          ${aritmaField}
          ${bechField}
          ${edenField}
          ${meteField}
          ${mikuField}
          </table>
        `);
    }

    if (path === psmfPaths.search) {
      return createFakeHTMLResponse(teamPage, teamPagePath);
    }

    if (path === psmfPaths.matchSchedule(teamPagePath)) {
      delay(5000);
      return createFakeHTMLResponse(matchesPage);
    }

    if (path === psmfPaths.currentTable(leaguePagePath)) {
      delay(2000);
      return createFakeHTMLResponse(leagueTablePage);
    }

    if (path === psmfPaths.teamsScript) {
      return createFakeJsonScriptDataResponse([
        { id: "1", label: "Viktoria Bítovská A" },
        { id: "2", label: "Pražská eS" },
      ]);
    }
  },
};

export default mockClient;
