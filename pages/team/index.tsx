import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import useSWR from "swr";
import { Placeholder, Segment, Menu, Button } from "semantic-ui-react";

import { getFieldsList } from "lib/scrapper";
import type { MatchSchedule } from "lib/scrapper";
import type { UnwrapPromise } from "lib/types";
import { getOnlyItem, fetcher } from "lib/utils";

import Match from "components/Match";
import { FieldsProvider } from "components/FieldsProvider";
import type { FieldsById } from "components/FieldsProvider";

export function useSchedule(id: string) {
  const { data, error } = useSWR<{ team: string; schedule: MatchSchedule }>(
    id ? `/api/schedule/${id}?futureOnly` : null,
    fetcher
  );
  const { team, schedule } = data ?? {};

  return {
    team,
    schedule,
    isLoading: !error && !data,
    isError: error,
  };
}

const matchPlaceholder = (
  <Segment>
    <Placeholder fluid>
      <Placeholder.Line length="short" />
      <Placeholder.Line length="long" />
      <Placeholder.Line length="short" />
    </Placeholder>
  </Segment>
);

export async function getStaticProps() {
  const fields = await getFieldsList();
  const fieldsByAbbr: FieldsById = fields.reduce((byAbbr, field) => {
    byAbbr[field.abbr] = field;
    return byAbbr;
  }, {});

  return {
    props: {
      fields: fieldsByAbbr,
    },
  };
}

type Data = ReturnType<typeof getStaticProps>;
type Props = UnwrapPromise<Data>["props"];

const Team = ({ fields }: Props) => {
  const { query } = useRouter();
  const teamId = getOnlyItem(query.id);

  const { team, schedule, isLoading } = useSchedule(teamId);

  return (
    <FieldsProvider value={fields}>
      <section style={{ padding: "1em" }}>
        <Head>
          <title>Team {team}</title>
        </Head>

        {isLoading ? (
          <Placeholder>
            <Placeholder.Header>
              <Placeholder.Line />
            </Placeholder.Header>
          </Placeholder>
        ) : (
          <Menu>
            <Menu.Item header>{team}</Menu.Item>
            <Menu.Menu position="right">
              <Menu.Item>
                <Link href="/" passHref>
                  Změnit tým
                </Link>
              </Menu.Item>
            </Menu.Menu>
          </Menu>
        )}
        {isLoading && (
          <>
            {matchPlaceholder}
            {matchPlaceholder}
            {matchPlaceholder}
          </>
        )}

        {schedule?.length > 0 &&
          schedule.map((match) => (
            <Segment key={match.date}>
              <Match match={match} />
            </Segment>
          ))}
      </section>
    </FieldsProvider>
  );
};

export default Team;
