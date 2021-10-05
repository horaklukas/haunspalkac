import { getFieldsList } from "./fields";
import { getMatchesPagePath, getTeamMatches } from "./matches";


const main = async () => {
  try {
    const fields = await getFieldsList();
    // console.log({ fields });

    const team = "Viktoria Bítovská A";
    // const team = "Pražská eS";
    const path = await getMatchesPagePath(team);
    const titles = await getTeamMatches(path);
    console.log(titles);
  } catch (error) {
    console.error(error);
  }
};

main();
