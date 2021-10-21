import { when } from "jest-when";
import type { AxiosResponse } from "axios";

import psmf from "../api";
import { getTeamPagePath, getTeamsStatistics } from "../teams";

import {
  leaguePagePath,
  leagueTablePage,
  crossroadPage,
  teamPage,
  teamPagePath,
  crossroadTeamPath,
} from "./teams.fixtures";

jest.mock("../api", () => ({
  ...(jest.requireActual("../api") as any),
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

describe("Teams", () => {
  function createResponse(html: string, path?: string) {
    return {
      data: `
        <html>
        <head></head>
        <body>
        <div class="main-content">
        ${html}
        </div>
        </body>
        </html>
        `,
      request: {
        path,
      },
    } as AxiosResponse;
  }

  describe("getTeamPagePath", () => {
    beforeEach(() => {
      (psmf.get as jest.Mock).mockReset();
    });

    it("should return path when team title found in main content", async () => {
      const html = teamPage;
      const team = `Viktoria Bítovská A`;
      const expectedPath = teamPagePath;

      expect.assertions(1);

      when(psmf.get)
        .calledWith("vyhledavani", { params: { query: team } })
        .mockResolvedValue(createResponse(html, expectedPath));

      await expect(getTeamPagePath(team)).resolves.toEqual(expectedPath);
    });

    it("should find path from link when ambiguous results returned", async () => {
      const html = crossroadPage;
      const team = `Pražská eS`;
      const expectedPath = crossroadTeamPath;

      expect.assertions(1);

      when(psmf.get)
        .calledWith("vyhledavani", { params: { query: team } })
        .mockResolvedValue(createResponse(html, expectedPath));

      await expect(getTeamPagePath(team)).resolves.toEqual(expectedPath);
    });

    it("should throw when correct team path not found", async () => {
      const html = ``;
      const team = `pražskáEs`;

      expect.assertions(1);

      when(psmf.get)
        .calledWith("vyhledavani", { params: { query: team } })
        .mockResolvedValue(createResponse(html));

      await expect(getTeamPagePath(team)).rejects.toThrow(
        `Coulnd't get team page path`
      );
    });
  });

  describe("getTeamsStatistics", () => {
    beforeEach(() => {
      (psmf.get as jest.Mock).mockReset();
    });

    it("should return teams statistics", async () => {
      const html = leagueTablePage;

      expect.assertions(3);

      when(psmf.get)
        .calledWith(`${leaguePagePath}prubezna-tabulka`)
        .mockResolvedValue(createResponse(html));

      const statistics = await getTeamsStatistics(leaguePagePath);

      expect(statistics).toHaveLength(12);
      expect(statistics[0]).toEqual({
        order: 1,
        name: "Nanosekundy",
        matches: 6,
        wins: 6,
        draws: 0,
        loses: 0,
        score: "43:6",
        points: 12,
      });
      expect(statistics[11]).toEqual({
        order: 12,
        name: "Bröndby codein IF",
        matches: 5,
        wins: 0,
        draws: 1,
        loses: 4,
        score: "4:31",
        points: 1,
      });
    });
  });
});
