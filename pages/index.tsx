import Head from "next/head";

import { Header, Grid, Segment } from "semantic-ui-react";

import { getTeams } from "lib/scrapper";
import type { UnwrapPromise } from "lib/types";
import { MINUTE } from "lib/constants";

import TeamSelect from "components/TeamSelect";

export async function getStaticProps() {
  const suggestions = await getTeams();

  return {
    props: {
      suggestions,
    },
    // revalidat list of teams (which is pretty static) once per week is enough
    revalidate: 7 * 24 * 60 * MINUTE,
  };
}

type Data = ReturnType<typeof getStaticProps>;
type Props = UnwrapPromise<Data>["props"];

const Home = ({ suggestions }: Props) => {
  return (
    <>
      <Head>
        <title>Haunspalkáč</title>
      </Head>

      <Grid style={{ height: "100vh" }} verticalAlign="middle" centered>
        <Grid.Column style={{ maxWidth: 450, textAlign: "center" }}>
          <Header as="h1">Haunspalkáč</Header>
          <Segment padded="very">
            <TeamSelect teams={suggestions} />
          </Segment>
        </Grid.Column>
      </Grid>
    </>
  );
};

export default Home;
