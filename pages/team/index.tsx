import { useRouter } from "next/router";
import Head from "next/head";
import { intlFormat } from "date-fns";

import { getFieldsList } from "../../src/scrapper";
import type { Field } from "../../src/scrapper";
import type { UnwrapPromise } from "../../src/types";
import { useSchedule } from "../../src/hooks";
import { getOnlyItem } from "../../src/utils";

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
    <div className="container">
      <Head>
        <title>Team {team}</title>
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <main>
        <h1 className="title">Team {team}</h1>

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
      </main>
    </div>
  );
};

export default Team;
