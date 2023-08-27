import { leaguePathFromTeamPage } from "../utils";

describe("leaguePathFromTeamPage", () => {
  it("should convert team path to league path", () => {
    const teamPagePath =
      "/souteze/2021-hanspaulska-liga-podzim/7-e/tymy/prazska-es/";

    expect(leaguePathFromTeamPage(teamPagePath)).toEqual(
      "/souteze/2021-hanspaulska-liga-podzim/7-e/"
    );
  });
});
