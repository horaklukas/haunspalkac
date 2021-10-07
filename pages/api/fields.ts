import { NextApiRequest, NextApiResponse } from "next";

import { getFieldsList } from "../../lib/scrapper";

const fields = async (req: NextApiRequest, res: NextApiResponse) => {
  const fields = await getFieldsList();

  res.status(200).json(fields);
};

export default fields;
