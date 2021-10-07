import { useRouter } from "next/router";
import Head from "next/head";
import useSWR from "swr";
import { Header, Placeholder, Segment } from "semantic-ui-react";

import { getFieldsList } from "../../lib/scrapper";
import type { FieldData, MatchSchedule } from "../../lib/scrapper";
import type { UnwrapPromise } from "../../lib/types";
import { getOnlyItem, fetcher } from "../../lib/utils";

import Match from "../../components/Match";

export function useSchedule(id: string) {
  const { data, error } = useSWR<{ team: string; schedule: MatchSchedule }>(
    id ? `/api/schedule/${id}` : null,
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
  const fieldsByAbbr: Record<string, FieldData> = fields.reduce(
    (byAbbr, field) => {
      byAbbr[field.abbr] = field;
      return byAbbr;
    },
    {}
  );

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
    <section style={{ padding: "1em" }}>
      <Head>
        <title>Team {team}</title>
      </Head>

      <Header as="h1" textAlign="center">
        {isLoading ? (
          <Placeholder style={{ margin: "0 auto" }}>
            <Placeholder.Header>
              <Placeholder.Line />
            </Placeholder.Header>
          </Placeholder>
        ) : (
          team
        )}
      </Header>
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
            <Match match={match} fields={fields} />
          </Segment>
        ))}
    </section>
  );
};

export default Team;
