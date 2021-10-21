import type { AxiosResponse } from "axios";
import { delay as lodashDelay } from "lodash";
import { psmfPaths } from "../config";

import {
  aritmaField,
  bechField,
  edenField,
  meteField,
  mikuField,
} from "../__tests__/fields.fixtures";
import { matchesPage } from "../__tests__/matches.fixtures";
import {
  leaguePagePath,
  leagueTablePage,
  teamPage,
  teamPagePath,
} from "../__tests__/teams.fixtures";

function delay(timeout: number) {
  return new Promise((resolve) => lodashDelay(resolve, timeout));
}

function createFakeResponse(data: string, path?: string) {
  return {
    data,
    request: {
      path,
    },
  } as AxiosResponse;
}

function createFakeHTMLResponse(html: string, path?: string) {
  return createFakeResponse(
    `
        <html>
        <head></head>
        <body>
        <div class="main-content">
        ${html}
        </div>
        </body>
        </html>
        `,

    path
  );
}

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
      return createFakeResponse(
        `
            var searchJsonData = [
              "Viktoria Bítovská A",
              "Pražská eS",
            ];
            var formJsonData = [
              { "id": "1", "label": "Viktoria Bítovská A" },
              { "id": "2", "label": "Pražská eS" }
            ]
          `
      );
    }
  },
};

export default mockClient;
