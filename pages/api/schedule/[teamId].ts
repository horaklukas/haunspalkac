import { isAfter } from "date-fns";
import { NextApiRequest, NextApiResponse } from "next";

import {
  getMatchesPagePath,
  getTeamMatches,
  getTeamName,
} from "../../../lib/scrapper";
import { getOnlyItem } from "../../../lib/utils";

const matches = async (req: NextApiRequest, res: NextApiResponse) => {
  const { teamId, futureOnly } = req.query;
  const id = getOnlyItem(teamId);

  try {
    const team = await getTeamName(id);

    const path = await getMatchesPagePath(team);
    const matches = await getTeamMatches(path);

    const nowDate = new Date();
    const schedule =
      futureOnly !== undefined
        ? matches.filter((match) => isAfter(new Date(match.date), nowDate))
        : matches;

    res.status(200).json({
      team,
      schedule,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export default matches;
