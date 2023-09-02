import { Fragment, Suspense } from "react";
import { notFound } from "next/navigation";
import { /* isBefore, */ format } from "date-fns";
// import clsx from "clsx";
// import { cs } from "date-fns/locale";

import { getTeamData, getTeams } from "@/lib/scrapper";

async function getTeamDetail(teamId: string) {
  const teamData = await getTeamData(teamId);

  if (!teamData) {
    notFound();
  }

  return teamData;
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

                <span className="text-xl justify-self-end mr-3">{teams.home && allTeams.get(teams.home)?.label}</span>
                <span className="text-sm text-slate-400">
                  {format(date, 'HH:mm',)}
                </span>
                <span className="text-xl ml-3">{teams.away && allTeams.get(teams.away)?.label}</span>
                <span className="text-sm text-slate-400 justify-self-end ml-4">{field}</span>
              </Fragment>
            )
          })}
        </div>

      </Suspense>
    </main>
  );
}
