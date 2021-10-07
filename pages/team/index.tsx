import { useRouter } from "next/router";
import Head from "next/head";
import { getFieldsList } from "../../src/scrapper";
import type { UnwrapPromise } from "../../src/types";

export async function getStaticProps() {
  const fields = await getFieldsList();

  return {
    props: {
      fields,
    },
  };
}

type Data = ReturnType<typeof getStaticProps>;
type Props = UnwrapPromise<Data>["props"];

const Team = ({ fields, ...props }: Props) => {
  const { query } = useRouter();
  const teamId = query.id;

  return (
    <div className="container">
      <Head>
        <title>Team {teamId} data</title>
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <main>
        <h1 className="title">Team {teamId} data</h1>

        {/* {fields.length > 0 && <pre>{JSON.stringify(fields, null, 2)}</pre>} */}
        {/* {schedule?.length > 0 && <pre>{JSON.stringify(schedule, null, 2)}</pre>} */}
      </main>
    </div>
  );
};

export default Team;
