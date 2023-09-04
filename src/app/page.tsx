

import { Suspense } from 'react';

import TeamSelect from '@/components/TeamSelect';
import { getTeams } from '@/lib/scrapper';

export default async function Home() {
  const teams = await getTeams();

  return (
    <main className="flex min-h-screen flex-col items-center md:justify-center gap-3 px-6 pb-6 pt-10 md:p-24">
      <Suspense fallback={<div>Loading...</div>}>
        <TeamSelect teams={teams} />
      </Suspense>
    </main>
  )
}
