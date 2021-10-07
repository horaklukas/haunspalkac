import { NextApiRequest, NextApiResponse } from "next";

import { getMatchesPagePath, getTeamMatches } from "../../../src/scrapper";

const matches = async (req: NextApiRequest, res: NextApiResponse) => {
  // TODO team should come from request

  // const team = "Viktoria Bítovská A";
  const team = "Pražská eS";

  const path = await getMatchesPagePath(team);
  const schedule = await getTeamMatches(path);

  res.status(200).json(schedule);
};

export default matches;
