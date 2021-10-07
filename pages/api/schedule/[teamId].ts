import { NextApiRequest, NextApiResponse } from "next";

import {
  getMatchesPagePath,
  getTeamMatches,
  getTeamName,
} from "../../../src/scrapper";
import { getOnlyItem } from "../../../src/utils";

const matches = async (req: NextApiRequest, res: NextApiResponse) => {
  const { teamId } = req.query;

  const id = getOnlyItem(teamId);

  try {
    const team = await getTeamName(id);

    const path = await getMatchesPagePath(team);
    const schedule = await getTeamMatches(path);

    res.status(200).json({
      team,
      schedule,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export default matches;
