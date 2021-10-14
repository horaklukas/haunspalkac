import { useRouter } from "next/router";
import Head from "next/head";

import {
  getFieldsList,
  getMatchesPagePath,
  getTeamMatches,
  getTeamName,
} from "lib/scrapper";
import type { MatchSchedule } from "lib/scrapper";
import { getOnlyItem } from "lib/utils";

import { FieldsProvider } from "components/FieldsProvider";
import type { FieldsById } from "components/FieldsProvider";
import MatchesSchedule from "components/MatchesSchedule";
import TeamHeader, {
  placeholder as teamHeaderPlaceholder,
} from "components/TeamHeader";
import { isAfter } from "date-fns";
import { GetStaticPaths, GetStaticProps } from "next";

interface Props {
  fields: FieldsById;
  team: string;
  schedule: MatchSchedule;
}

const MINUTE = 60;

const getTeamData = async (teamId: string) => {
  const team = await getTeamName(teamId);

  const path = await getMatchesPagePath(team);
  const matches = await getTeamMatches(path);

  const nowDate = new Date();
  const schedule = matches.filter((match) =>
    isAfter(new Date(match.date), nowDate)
  );

  return {
    team,
    schedule,
  };
};

const getFieldsData = async () => {
  const fields = await getFieldsList();

  const fieldsByAbbr: FieldsById = fields.reduce((byAbbr, field) => {
    byAbbr[field.abbr] = field;
    return byAbbr;
  }, {});

  return fieldsByAbbr;
};

export const getStaticProps: GetStaticProps<Props> = async (req) => {
  const teamId = getOnlyItem(req.params.teamId);

  const [fields, teamData] = await Promise.all([
    getFieldsData(),
    getTeamData(teamId),
  ]);
  const { team, schedule } = teamData;

  return {
    props: {
      fields,
      team,
      schedule,
    },
    revalidate: MINUTE * 60,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: true };
};

const Team = ({ fields, team, schedule }: Props) => {
  const { isFallback: isLoading } = useRouter();

  return (
    <FieldsProvider value={fields}>
      <section style={{ padding: "1em" }}>
        <Head>
          <title>Team {team}</title>
        </Head>

        {isLoading ? teamHeaderPlaceholder : <TeamHeader team={team} />}

        <MatchesSchedule isLoading={isLoading} schedule={schedule} />
      </section>
    </FieldsProvider>
  );
};

export default Team;
