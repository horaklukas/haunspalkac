

import { Suspense } from 'react';
import { ErrorBoundary } from "react-error-boundary";


import TeamSelect from '@/components/TeamSelect';
import { getTeams } from '@/lib/scrapper';

function Fallback() {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
    </div>
  );
}

export default async function Home() {
  const teams = await getTeams();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 p-24">
      <ErrorBoundary fallback={<Fallback />}>
        <Suspense fallback={<div>Loading...</div>}>
          <TeamSelect teams={teams} />
        </Suspense>
      </ErrorBoundary>
    </main>
  )
}
