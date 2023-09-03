import { Fragment, Suspense } from "react";
import { notFound } from "next/navigation";
import { /* isBefore, */ format } from "date-fns";
// import clsx from "clsx";
// import { cs } from "date-fns/locale";

import { TeamDataMap, TeamInfo, getTeamData, getTeams } from "@/lib/scrapper";
import { getFullPsmfUrl } from "@/lib/scrapper/utils";

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

          return <rect key={color} x={1 + (colorWidth * i)} y={1} height={32} width={colorWidth} fill={color} />
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

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 p-12">
      <Suspense fallback={<div>Loading team matches...</div>}>
        <h1 className="text-2xl mb-5">{team.label}</h1>
        <div className="grid items-center gap-4" style={{ gridTemplateColumns: 'auto auto minmax(0, 1fr) auto minmax(0, 1fr) auto' }}>
          {matches.map(({ date, teams, round, field }) => {
            // const isInPast = isBefore(date, nowDate)
            return (
              <Fragment key={date.toString()} >
                <span className="text-sm text-slate-400 justify-self-end">{round}.</span>
                <span className="inline-flex flex-col justify-between shrink-0 grow-0 w-14 h-14 bg-slate-300 text-black rounded text-center overflow-hidden pb-1">
                  <span className="inline-block bg-red-700 h-2 w-full"></span>
                  <strong className="text-lg">{date.getDate()}</strong>
                  <small className="text-red-700 text-xs uppercase">{format(date, 'LLL yy', /* { locale: cs } */)}</small>
                </span>

                <span className="justify-self-end mr-3 inline-flex gap-3">
                  <TeamName team={allTeams.get(teams.home.id ?? '')} />
                  {teams.home.shirtColors && teams.home.shirtColors.length > 0 && (
                    <ShirtColors colors={teams.home.shirtColors} />
                  )}
                </span>
                <span className="text-sm text-slate-400">
                  {format(date, 'HH:mm',)}
                </span>
                <span className="ml-3 inline-flex gap-3">
                  {teams.away.shirtColors && teams.away.shirtColors.length > 0 && (
                    <ShirtColors colors={teams.away.shirtColors} />
                  )}
                  <TeamName team={allTeams.get(teams.away.id ?? '')} />
                </span>
                <span className="text-sm text-slate-400 justify-self-end ml-4">{field}</span>
              </Fragment>
            )
          })}
        </div>

      </Suspense>
    </main>
  );
}
