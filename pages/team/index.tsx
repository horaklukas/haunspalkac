import { useRouter } from "next/router";
import Head from "next/head";
import { intlFormat } from "date-fns";
import useSWR from "swr";
import { Header } from "semantic-ui-react";

import { getFieldsList } from "../../lib/scrapper";
import type { Field, MatchSchedule } from "../../lib/scrapper";
import type { UnwrapPromise } from "../../lib/types";
import { getOnlyItem, fetcher } from "../../lib/utils";

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

export async function getStaticProps() {
  const fields = await getFieldsList();
  const fieldsByAbbr: Record<string, Field> = fields.reduce((byAbbr, field) => {
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

  const { team, schedule } = useSchedule(teamId);

  return (
    <>
      <Head>
        <title>Team {team}</title>
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <Header as="h1">Team</Header>

      {schedule?.length > 0 &&
        schedule.map((match) => (
          <div>
            {intlFormat(
              new Date(match.date),
              {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              },
              {
                locale: "cs-CZ",
              }
            )}{" "}
            hraje {match.teams.home} vs. {match.teams.away} na hřišti
            {fields[match.field]?.name}
          </div>
        ))}
    </>
  );
};

export default Team;
