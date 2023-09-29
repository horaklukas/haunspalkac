import { Fragment, Suspense } from "react";
import { notFound } from "next/navigation";
import { isBefore, format } from "date-fns";
import { cs, enUS } from "date-fns/locale";

import { TeamInfo, getFieldsById, getTeamData, getTeams } from "@/lib/scrapper";
import { getFullPsmfUrl } from "@/lib/scrapper/utils";
import { AddToCalendarButton } from "@/components/AddToCalendarButton";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

import styles from './styles.module.scss'
import { partition } from "lodash";
import { getTranslator } from "next-intl/server";
import { Metadata } from "next";

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

const ShirtColors = ({ colors }: { colors: string[] }) => {
  return (
    <svg viewBox="0 0 34 34" width="1.2em" height="1.2em">
      <mask id="shirt-mask">
        <circle cx="17" cy="17" r="16" fill="white" />
      </mask>
      <g mask="url(#shirt-mask)">
        {colors.map((color, i) => {
          const colorWidth = Math.round(32 / colors.length);

          return <rect key={color + i.toString()} x={1 + (colorWidth * i)} y={1} height={32} width={colorWidth} fill={color} />
        })}
      </g>
      <circle cx="17" cy="17" r="16" fill="none" stroke="white" strokeWidth="1" />
    </svg>
  )
}

const getTeamUrl = (urlPath?: string) => urlPath ? getFullPsmfUrl(urlPath).toString() : ''

const TeamName = ({ team }: { team?: TeamInfo }) => {
  if (!team) {
    return null
  }

  const { urlPath, label } = team

  return (
    <a className="text-xl hover:text-yellow-600" href={getTeamUrl(urlPath)} target="_blank" rel="noopener noreferrer">
      {label}
    </a >
  )
}

type TeamDetailProps = {
  params: {
    teamId: string;
    locale: 'cs' | 'en';
  };
};

export async function generateMetadata({
  params: { locale, teamId }
}: TeamDetailProps): Promise<Metadata> {
  const t = await getTranslator(locale, 'team.seo');
  const { team } = await getTeamDetail(teamId);

  const teamName = team.label

  return {
    title: t('title', { teamName }),
    description: t('description', { teamName }),
    openGraph: {
      title: t('title', { teamName }),
      description: t('description', { teamName }),
    },
  };
}

export default async function TeamDetail({ params: { locale, teamId } }: TeamDetailProps) {
  const t = await getTranslator(locale, 'team');

  const { team, matches } = await getTeamDetail(teamId);
  const allTeams = await getTeams()
  const fields = await getFieldsById()

  const nowDate = new Date();
  const [pastMatches, futureMatches] = partition(matches, ({ date }) => isBefore(date, nowDate))

  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-3 p-5 pt-14 md:p-12">
      <Link href="/" passHref>
        <Button variant="outline" size="sm" className="absolute text-xs top-3 left-5">
          🙎 {t('selectOther')}
        </Button>
      </Link>

      <header className="flex mb-5 border-b border-white">
        <h1 className="text-2xl">
          <a href={getTeamUrl(team.urlPath)} target="_blank" className="hover:text-yellow-600">{team.label}</a>
        </h1>
      </header>


      {pastMatches.length > 0 && (
        <p className={`text-slate-500 text-xs text-center`}>
          {t('pastMatches', { count: pastMatches.length })}
        </p>
      )}
      <section className={`grid items-center w-full gap-x-5 gap-y-2 md:gap-y-4 md:w-auto ${styles.schedule}`}>
        {futureMatches.map(({ date, teams, round, field }) => {
          const homeTeam = allTeams.get(teams.home.id ?? '')
          const awayTeam = allTeams.get(teams.away.id ?? '')
          const fieldInfo = fields.get(field)

          return (
            <Fragment key={date.toString()} >
              <span className="hidden text-sm text-slate-400 justify-self-end md:block" id={`round-${round}`}>{round}.</span>

              <span className="inline-flex flex-col justify-between pb-1 ml-1 overflow-hidden text-center text-black rounded shrink-0 grow-0 w-14 h-14 bg-slate-300">
                <span className="inline-block w-full h-2 bg-red-700"></span>
                <strong className="text-lg">{date.getDate()}</strong>
                <small className="text-xs text-red-700">
                  <span className="uppercase">{format(date, 'LLL', { locale: dateLocales[locale] ?? cs })}</span> 
                  <span className="capitalize">, {format(date, 'EEEEEE', { locale: dateLocales[locale] ?? cs })}</span>
                </small>
              </span>

              <div className={`flex flex-col gap-y-1 md:grid ${styles.teams}`}>
                <span className="inline-flex items-center gap-3 md:flex-row-reverse md:mr-3 md:justify-self-end">
                  {teams.home.shirtColors && teams.home.shirtColors.length > 0 && (
                    <ShirtColors colors={teams.home.shirtColors} />
                  )}
                  <TeamName team={homeTeam} />
                </span>
                <span className="text-sm text-slate-400">
                  {format(date, 'HH:mm',)}
                </span>
                <span className="inline-flex items-center gap-3 md:ml-3">
                  {teams.away.shirtColors && teams.away.shirtColors.length > 0 && (
                    <ShirtColors colors={teams.away.shirtColors} />
                  )}
                  <TeamName team={awayTeam} />
                </span>
              </div>

              <a href={fieldInfo?.link ?? ''} target="_blank" className={`text-sm text-slate-400 hover:text-yellow-600 ml-1 md:justify-self-end md:ml-4 ${styles.field}`}>
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

              <hr className={`col-span-full border-t border-slate-400 mt-1 mb-5 md:hidden ${styles.separator}`} />
            </Fragment>
          )
        })}
      </section>
    </main>
  );
}
