import Head from "next/head";
import { getFieldsList, getMatchesPagePath, getTeamMatches } from "../src/scrapper";

export async function getStaticProps() {
  // const team = "Viktoria Bítovská A";
  const team = "Pražská eS";

  const path = await getMatchesPagePath(team);
  const schedule = await getTeamMatches(path);

  const fields = await getFieldsList();

  return {
    props: {
      fields,
      schedule,
    },
  };
}

const Home = ({ schedule }) => {
  return (
    <div className="container">
      <Head>
        <title>Haunspalkáč</title>
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <main>
        <h1 className="title">Haunspalkáč</h1>

        {/* {fields.length > 0 && <pre>{JSON.stringify(fields, null, 2)}</pre>} */}
        {schedule?.length > 0 && <pre>{JSON.stringify(schedule, null, 2)}</pre>}
      </main>
    </div>
  );
};

export default Home;
