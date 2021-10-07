import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { getTeams } from "../src/scrapper";
import type { UnwrapPromise } from "../src/types";

export async function getStaticProps() {
  const suggestions = await getTeams();

  return {
    props: {
      suggestions,
    },
  };
}

type Data = ReturnType<typeof getStaticProps>;
type Props = UnwrapPromise<Data>["props"];

const Home = ({ suggestions }: Props) => {
  const [teamId, setTeamId] = useState(null);

  return (
    <div className="container">
      <Head>
        <title>Haunspalkáč</title>
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <main>
        <h1 className="title">Haunspalkáč</h1>

        {suggestions.length > 0 ? (
          <>
            <label>Select team</label>
            <br />
            <select onChange={(e) => setTeamId(e.target.value)}>
              {suggestions.map((team) => (
                <option key={team.id} value={team.id}>{team.label}</option>
              ))}
            </select>
            <br />
            {teamId && (
              <Link href={{ pathname: `team`, query: { id: teamId } }}>
                Show team
              </Link>
            )}
          </>
        ) : (
          "Sorry no data"
        )}
      </main>
    </div>
  );
};

export default Home;
