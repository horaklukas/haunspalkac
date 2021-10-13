import { when } from "jest-when";
import psmf from "../api";
import { getMatchesPagePath, getTeamMatches } from "../matches";
import {
  crossroadPage,
  teamPage,
  matchesPage,
  teamPagePath,
  crossroadTeamPath,
} from "./matches.fixtures";
import type { AxiosResponse } from "axios";

jest.mock("../api", () => ({
  ...(jest.requireActual("../api") as any),
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

describe("Matches", () => {
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

  describe("getMatchesPagePath", () => {
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

      await expect(getMatchesPagePath(team)).resolves.toEqual(expectedPath);
    });

    it("should find path from link when ambiguous results returned", async () => {
      const html = crossroadPage;
      const team = `Pražská eS`;
      const expectedPath = crossroadTeamPath;

      expect.assertions(1);

      when(psmf.get)
        .calledWith("vyhledavani", { params: { query: team } })
        .mockResolvedValue(createResponse(html, expectedPath));

      await expect(getMatchesPagePath(team)).resolves.toEqual(expectedPath);
    });

    it("should throw when correct team path not found", async () => {
      const html = ``;
      const team = `pražskáEs`;

      expect.assertions(1);

      when(psmf.get)
        .calledWith("vyhledavani", { params: { query: team } })
        .mockResolvedValue(createResponse(html));

      await expect(getMatchesPagePath(team)).rejects.toThrow(
        `Coulnd't get team matches path`
      );
    });
  });

  describe("getTeamMatches", () => {
    beforeAll(() => {
      when(psmf.get)
        .calledWith(`${teamPagePath}rozpis-zapasu`)
        .mockResolvedValue(createResponse(matchesPage));
    });

    it("should return list of matches", async () => {
      expect.assertions(1);

      await expect(getTeamMatches(teamPagePath)).resolves.toHaveLength(11);
    });

    it("should parse team names", async () => {
      expect.assertions(11);

      const matches = await getTeamMatches(teamPagePath);

      expect(matches[0]).toHaveProperty("teams", {
        home: "Viktoria Bítovská A",
        away: "Footside",
      });
      expect(matches[1]).toHaveProperty("teams", {
        home: "Chrontodont ARV",
        away: "Viktoria Bítovská A",
      });
      expect(matches[2]).toHaveProperty("teams", {
        home: "Viktoria Bítovská A",
        away: "Proposito FC",
      });
      expect(matches[3]).toHaveProperty("teams", {
        home: "Los Muchachos",
        away: "Viktoria Bítovská A",
      });
      expect(matches[4]).toHaveProperty("teams", {
        home: "Viktoria Bítovská A",
        away: "Toyota FC",
      });
      expect(matches[5]).toHaveProperty("teams", {
        home: "Uličníci FC",
        away: "Viktoria Bítovská A",
      });
      expect(matches[6]).toHaveProperty("teams", {
        home: "Viktoria Bítovská A",
        away: "Bába FC",
      });
      expect(matches[7]).toHaveProperty("teams", {
        home: "Dejnámbůra FC",
        away: "Viktoria Bítovská A",
      });
      expect(matches[8]).toHaveProperty("teams", {
        home: "Viktoria Bítovská A",
        away: "Šílené veverky",
      });
      expect(matches[9]).toHaveProperty("teams", {
        home: "Arabská",
        away: "Viktoria Bítovská A",
      });
      expect(matches[10]).toHaveProperty("teams", {
        home: "Viktoria Bítovská A",
        away: "Velmistři prokrastinace",
      });
    });

    it("should parse match dates", async () => {
      expect.assertions(11);

      const matches = await getTeamMatches(teamPagePath);

      expect(matches[0]).toHaveProperty("date", "2021-09-08T16:00:00.000Z");
      expect(matches[1]).toHaveProperty("date", "2021-09-15T16:15:00.000Z");
      expect(matches[2]).toHaveProperty("date", "2021-09-22T18:30:00.000Z");
      expect(matches[3]).toHaveProperty("date", "2021-09-29T18:00:00.000Z");
      expect(matches[4]).toHaveProperty("date", "2021-10-05T17:15:00.000Z");
      expect(matches[5]).toHaveProperty("date", "2021-10-13T18:45:00.000Z");
      expect(matches[6]).toHaveProperty("date", "2021-10-20T15:45:00.000Z");
      expect(matches[7]).toHaveProperty("date", "2021-10-27T17:00:00.000Z");
      expect(matches[8]).toHaveProperty("date", "2021-11-09T18:15:00.000Z");
      expect(matches[9]).toHaveProperty("date", "2021-11-17T17:45:00.000Z");
      expect(matches[10]).toHaveProperty("date", "2021-12-01T19:45:00.000Z");
    });

    it("should parse match field", async () => {
      expect.assertions(11);

      const matches = await getTeamMatches(teamPagePath);

      expect(matches[0]).toHaveProperty("field", "SANC1");
      expect(matches[1]).toHaveProperty("field", "PRKOP");
      expect(matches[2]).toHaveProperty("field", "STER2");
      expect(matches[3]).toHaveProperty("field", "ARIT");
      expect(matches[4]).toHaveProperty("field", "HRAB3");
      expect(matches[5]).toHaveProperty("field", "DEKAN");
      expect(matches[6]).toHaveProperty("field", "MIKU2");
      expect(matches[7]).toHaveProperty("field", "MIKU3");
      expect(matches[8]).toHaveProperty("field", "ZAK");
      expect(matches[9]).toHaveProperty("field", "ARIT");
      expect(matches[10]).toHaveProperty("field", "STER1");
    });
  });
});
