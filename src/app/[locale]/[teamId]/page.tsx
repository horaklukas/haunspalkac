import { Fragment } from "react";
import { notFound } from "next/navigation";
import { isBefore } from "date-fns";
import { OptionsWithTZ, format } from "date-fns-tz";
import { cs, enUS } from "date-fns/locale";

import {
  MatchData,
  getFieldsById,
  getTeamData,
  getTeams,
} from "@/lib/scrapper";
import { AddToCalendarButton } from "@/components/AddToCalendarButton";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

import styles from "./styles.module.scss";
import { partition } from "lodash";
import { getTranslator } from "next-intl/server";
import { Metadata } from "next";
import { MatchTime } from "@/components/match/MatchTime";
import { formatMatchTime, getTeamUrl } from "@/utils";
import { ShirtColors } from "@/components/match/ShirtColors";
import { TeamName } from "@/components/match/TeamName";

const dateLocales = {
  cs,
  en: enUS,
}

async function getTeamDetail(teamId: string) {
  const teamData = await getTeamData(teamId);

  if (!teamData) {
    notFound();
  }

  return teamData;
}

const isPastMatch = (match: MatchData, nowDate: Date = new Date()) =>
  isBefore(match.date, nowDate);

type TeamDetailProps = {
  params: {
    teamId: string;
    locale: "cs" | "en";
  };
};

export async function generateMetadata({
  params: { locale, teamId },
}: TeamDetailProps): Promise<Metadata> {
  const t = await getTranslator(locale, "team.seo");
  const { team, matches } = await getTeamDetail(teamId);
  const allTeams = await getTeams();
  const fields = await getFieldsById();

  const teamName = team.label;

  const [nextMatch] = matches.filter((match) => !isPastMatch(match));

  let ogTitle = null
  let ogDescription = null

  if (nextMatch) {
    const homeTeam = allTeams.get(nextMatch.teams.home.id ?? "");
    const awayTeam = allTeams.get(nextMatch.teams.away.id ?? "");
    const matchDate = formatMatchTime(nextMatch.date, "d.MMM, EEEEEE, HH:mm", locale)
    const fieldInfo = fields.get(nextMatch.field);

    if (homeTeam && awayTeam) {
      ogTitle = `${matchDate} ${homeTeam.label} vs. ${awayTeam.label}`;
    }

    if (fieldInfo) {
      ogDescription = `${fieldInfo.name}, ${fieldInfo.address}`;
    }
  }


  return {
    title: t("title", { teamName }),
    description: t("description", { teamName }),
    openGraph: {
      title: ogTitle ?? t("title", { teamName }),
      description: ogDescription ?? t("description", { teamName }),
    },
  };
}

export default async function TeamDetail({
  params: { locale, teamId },
}: TeamDetailProps) {
  const t = await getTranslator(locale, "team");

  const { team, matches } = await getTeamDetail(teamId);
  const allTeams = await getTeams();
  const fields = await getFieldsById();

  const [pastMatches, futureMatches] = partition(matches, isPastMatch);

  const formatDateOptions: OptionsWithTZ = {
    timeZone: "Europe/Prague",
    locale: dateLocales[locale],
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-3 p-5 pt-14 md:p-12">
      <Link href="/" passHref>
        <Button
          variant="outline"
          size="sm"
          className="absolute text-xs top-3 left-5"
        >
          🙎 {t("selectOther")}
        </Button>
      </Link>

      <header className="flex mb-5 border-b border-white">
        <h1 className="text-2xl">
          <a
            href={getTeamUrl(team.urlPath)}
            target="_blank"
            className="hover:text-yellow-600"
          >
            {team.label}
          </a>
        </h1>
      </header>

      {pastMatches.length > 0 && (
        <p className={`text-slate-500 text-xs text-center`}>
          {t("pastMatches", { count: pastMatches.length })}
        </p>
      )}
      <section
        className={`grid items-center w-full gap-x-5 gap-y-2 md:gap-y-4 md:w-auto ${styles.schedule}`}
      >
        {futureMatches.map(({ date, teams, round, field }) => {
          const homeTeam = allTeams.get(teams.home.id ?? "");
          const awayTeam = allTeams.get(teams.away.id ?? "");
          const fieldInfo = fields.get(field);

          return (
            <Fragment key={date.toString()}>
              <span
                className="hidden text-sm text-slate-400 justify-self-end md:block"
                id={`round-${round}`}
              >
                {round}.
              </span>

              <span className="inline-flex flex-col justify-between pb-1 ml-1 overflow-hidden text-center text-black rounded shrink-0 grow-0 w-14 h-14 bg-slate-300">
                <span className="inline-block w-full h-2 bg-red-700"></span>
                <strong className="text-lg">{date.getDate()}</strong>
                <small className="text-xs text-red-700">
                  <span className="uppercase">
                    {format(date, "LLL", formatDateOptions)}
                  </span>
                  <span className="capitalize">
                    , {format(date, "EEEEEE", formatDateOptions)}
                  </span>
                </small>
              </span>

              <div className={`flex flex-col gap-y-1 md:grid ${styles.teams}`}>
                <span className="inline-flex items-center gap-3 md:flex-row-reverse md:mr-3 md:justify-self-end">
                  {teams.home.shirtColors &&
                    teams.home.shirtColors.length > 0 && (
                      <ShirtColors colors={teams.home.shirtColors} />
                    )}
                  <TeamName team={homeTeam} />
                </span>
                <MatchTime date={date} />
                <span className="inline-flex items-center gap-3 md:ml-3">
                  {teams.away.shirtColors &&
                    teams.away.shirtColors.length > 0 && (
                      <ShirtColors colors={teams.away.shirtColors} />
                    )}
                  <TeamName team={awayTeam} />
                </span>
              </div>

              <a
                href={fieldInfo?.link ?? ""}
                target="_blank"
                className={`text-sm text-slate-400 hover:text-yellow-600 ml-1 md:justify-self-end md:ml-4 ${styles.field}`}
              >
                {fieldInfo?.name}
              </a>

              {homeTeam && awayTeam && (
                <AddToCalendarButton
                  homeTeam={homeTeam}
                  awayTeam={awayTeam}
                  round={round}
                  date={date}
                  field={fieldInfo}
                />
              )}

              <hr
                className={`col-span-full border-t border-slate-400 mt-1 mb-5 md:hidden ${styles.separator}`}
              />
            </Fragment>
          );
        })}
      </section>
    </main>
  );
}
