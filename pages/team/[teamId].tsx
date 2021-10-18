import { useRouter } from "next/router";
import Head from "next/head";
import type { GetStaticPaths, GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

import { getFieldsById, getTeamData } from "lib/scrapper";
import type { MatchSchedule, FieldsById } from "lib/scrapper";
import { getOnlyItem } from "lib/utils";
import { MINUTE } from "lib/constants";

import { FieldsProvider } from "components/FieldsProvider";
import MatchesSchedule from "components/MatchesSchedule";
import TeamHeader, {
  placeholder as teamHeaderPlaceholder,
} from "components/TeamHeader";

interface Props {
  fields: FieldsById;
  team: string;
  schedule: MatchSchedule;
}

export const getStaticProps: GetStaticProps<Props> = async ({
  params,
  locale,
}) => {
  const teamId = getOnlyItem(params.teamId);
  const [id] = teamId.match(/(\d)*$/) ?? [];
  const translations = await serverSideTranslations(locale, [
    "common",
    "team-detail",
  ]);

  const [fields, teamData] = await Promise.all([
    getFieldsById(),
    getTeamData(id),
  ]);
  const { team, schedule } = teamData;

  return {
    props: {
      fields,
      team,
      schedule,
      ...translations,
    },
    revalidate: 60 * MINUTE,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: true };
};

const Team = ({ fields, team, schedule }: Props) => {
  const { t } = useTranslation("team-detail");
  const { isFallback: isLoading } = useRouter();

  return (
    <FieldsProvider value={fields}>
      <section style={{ padding: "1em" }}>
        <Head>
          <title>{t("team", { name: team })}</title>
        </Head>

        {isLoading ? teamHeaderPlaceholder : <TeamHeader team={team} />}

        <MatchesSchedule isLoading={isLoading} schedule={schedule} />
      </section>
    </FieldsProvider>
  );
};

export default Team;
