import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import useSWR from "swr";
import { Placeholder, Menu } from "semantic-ui-react";

import { getFieldsList } from "lib/scrapper";
import type { MatchSchedule } from "lib/scrapper";
import type { UnwrapPromise } from "lib/types";
import { getOnlyItem, fetcher } from "lib/utils";

import { FieldsProvider } from "components/FieldsProvider";
import type { FieldsById } from "components/FieldsProvider";
import MatchesSchedule from "components/MatchesSchedule";

export function useSchedule(id: string) {
  const router = useRouter();
  const { data, error } = useSWR<{ team: string; schedule: MatchSchedule }>(
    id ? `/api/schedule/${id}?futureOnly` : null,
    fetcher
  );
  const { team, schedule } = data ?? {};
  const isLoading = !error && !data;

  if (!team && !isLoading) {
    router.push("/");
  }

  return {
    team,
    schedule,
    isLoading,
    isError: error,
  };
}

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

        <MatchesSchedule isLoading={isLoading} schedule={schedule} />
      </section>
    </FieldsProvider>
  );
};

export default Team;
