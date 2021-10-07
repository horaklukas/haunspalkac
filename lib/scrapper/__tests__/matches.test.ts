import { when } from "jest-when";
import { psmf } from "../utils";
import { getMatchesPagePath, getTeamMatches } from "../matches";
import { crossroadPage, teamPage, matchesPage } from "./matches.fixtures";

jest.mock("../utils", () => ({
  ...(jest.requireActual("../utils") as object),
  psmf: {
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
    };
  }

  describe("getMatchesPagePath", () => {
    beforeEach(() => {
      (psmf.get as jest.Mock).mockReset();
    });

    it("should return path when team title found in main content", async () => {
      const html = teamPage;
      const team = `Viktoria Bítovská A`;
      const expectedPath = `/souteze/2021-hanspaulska-liga-podzim/7-f/tymy/viktoria-bitovska-a`;

      expect.assertions(1);

      when(psmf.get)
        .calledWith("vyhledavani", { params: { query: team } })
        .mockResolvedValue(createResponse(html, expectedPath));

      await expect(getMatchesPagePath(team)).resolves.toEqual(expectedPath);
    });

    it("should find path from link when ambiguous results returned", async () => {
      const html = crossroadPage;
      const team = `Pražská eS`;
      const expectedPath = `/souteze/2021-hanspaulska-liga-podzim/7-e/tymy/prazska-es/`;

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
    const teamPagePath =
      "/souteze/2021-hanspaulska-liga-podzim/7-f/tymy/viktoria-bitovska-a/";

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

      expect(matches[0]).toHaveProperty(
        "date",
        new Date(2021, 8, 8, 18).toISOString()
      );
      expect(matches[1]).toHaveProperty(
        "date",
        new Date(2021, 8, 15, 18, 15).toISOString()
      );
      expect(matches[2]).toHaveProperty(
        "date",
        new Date(2021, 8, 22, 20, 30).toISOString()
      );
      expect(matches[3]).toHaveProperty(
        "date",
        new Date(2021, 8, 29, 20).toISOString()
      );
      expect(matches[4]).toHaveProperty(
        "date",
        new Date(2021, 9, 5, 19, 15).toISOString()
      );
      expect(matches[5]).toHaveProperty(
        "date",
        new Date(2021, 9, 13, 20, 45).toISOString()
      );
      expect(matches[6]).toHaveProperty(
        "date",
        new Date(2021, 9, 20, 17, 45).toISOString()
      );
      expect(matches[7]).toHaveProperty(
        "date",
        new Date(2021, 9, 27, 19, 0).toISOString()
      );
      expect(matches[8]).toHaveProperty(
        "date",
        new Date(2021, 10, 9, 19, 15).toISOString()
      );
      expect(matches[9]).toHaveProperty(
        "date",
        new Date(2021, 10, 17, 18, 45).toISOString()
      );
      expect(matches[10]).toHaveProperty(
        "date",
        new Date(2021, 11, 1, 20, 45).toISOString()
      );
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
