import Head from "next/head";

import { Header, Grid, Segment } from "semantic-ui-react";

import { TeamSelect } from "../components";
import { getTeams } from "../lib/scrapper";
import type { UnwrapPromise } from "../lib/types";

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
