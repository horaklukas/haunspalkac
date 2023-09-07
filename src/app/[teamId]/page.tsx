import { Fragment, Suspense } from "react";
import { notFound } from "next/navigation";
import { isBefore, format } from "date-fns";
// import clsx from "clsx";
// import { cs } from "date-fns/locale";



import { TeamDataMap, TeamInfo, getTeamData, getTeams } from "@/lib/scrapper";
import { getFullPsmfUrl } from "@/lib/scrapper/utils";
import { AddToCalendarButton } from "@/components/AddToCalendarButton";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

import styles from './styles.module.scss'
import { partition } from "lodash";

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

const TeamName = ({ team }: { team?: TeamInfo }) => {
  if (!team) {
    return null
  }

  const { urlPath, label } = team

  return (
    <a className="text-xl" href={urlPath ? getFullPsmfUrl(urlPath).toString() : '#'} target="_blank" rel="noopener noreferrer">
      {label}
    </a >
  )
}

type TeamDetailProps = {
  params: {
    teamId: string;
  };
};

export default async function TeamDetail({ params }: TeamDetailProps) {
  const { team, matches } = await getTeamDetail(params.teamId);
  const allTeams = await getTeams()
  const nowDate = new Date();
  const [pastMatches, futureMatches] = partition(matches, ({ date }) => isBefore(date, nowDate))


  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 p-5 pt-14 md:p-12">
      <Link href="/" passHref>
        <Button variant="outline" size="sm" className="absolute top-3 left-5 text-xs">
          🙎 Select other team
        </Button>
      </Link>
      <Suspense fallback={<div>Loading team matches...</div>}>
        <header className="flex mb-5 border-b border-white">
          <h1 className="text-2xl">{team.label}</h1>
          {/* <AddToCalendarButton matches={matches} /> */}
        </header>


        {pastMatches.length > 0 && (
          <p className={`text-slate-500 text-xs text-center`}>
            {pastMatches.length === 1 ?
              `There is ${pastMatches.length} past match.` :
              `There are ${pastMatches.length} past matches.`
            }
          </p>
        )}
        <section className={`grid items-center w-full gap-x-5 gap-y-2 md:gap-y-4 md:w-auto ${styles.schedule}`}>
          {futureMatches.map(({ date, teams, round, field }) => {
            const homeTeam = allTeams.get(teams.home.id ?? '')
            const awayTeam = allTeams.get(teams.away.id ?? '')

            return (
              <Fragment key={date.toString()} >
                <span className="text-sm text-slate-400 justify-self-end hidden md:block" id={`round-${round}`}>{round}.</span>

                <span className="inline-flex flex-col justify-between shrink-0 grow-0 w-14 h-14 ml-1 bg-slate-300 text-black rounded text-center overflow-hidden pb-1">
                  <span className="inline-block bg-red-700 h-2 w-full"></span>
                  <strong className="text-lg">{date.getDate()}</strong>
                  <small className="text-red-700 text-xs uppercase">{format(date, 'LLL yy', /* { locale: cs } */)}</small>
                </span>

                <div className={`flex flex-col gap-y-1 md:grid ${styles.teams}`}>
                  <span className="inline-flex gap-3 items-center md:flex-row-reverse md:mr-3 md:justify-self-end">
                    {teams.home.shirtColors && teams.home.shirtColors.length > 0 && (
                      <ShirtColors colors={teams.home.shirtColors} />
                    )}
                    <TeamName team={homeTeam} />
                  </span>
                  <span className="text-sm text-slate-400">
                    {format(date, 'HH:mm',)}
                  </span>
                  <span className="inline-flex gap-3 items-center md:ml-3">
                    {teams.away.shirtColors && teams.away.shirtColors.length > 0 && (
                      <ShirtColors colors={teams.away.shirtColors} />
                    )}
                    <TeamName team={awayTeam} />
                  </span>
                </div>

                <span className={`text-sm text-slate-400 ml-1 md:justify-self-end md:ml-4 ${styles.field}`}>{field}</span>

                {homeTeam && awayTeam && (
                  <AddToCalendarButton
                    homeTeam={homeTeam}
                    awayTeam={awayTeam}
                    round={round}
                    date={date}
                    location={field}
                  />
                )}

                <hr className={`col-span-full border-t border-slate-400 mt-1 mb-5 md:hidden ${styles.separator}`} />
              </Fragment>
            )
          })}
        </section>

      </Suspense>
    </main>
  );
}
