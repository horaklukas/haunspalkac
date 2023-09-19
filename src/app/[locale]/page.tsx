import TeamSelect from '@/components/TeamSelect';
import { getTeams } from '@/lib/scrapper';


export default async function Home() {
  const teams = await getTeams();

  return (
    <main className="flex flex-col items-center min-h-screen gap-3 px-6 pt-10 pb-6 md:justify-center md:p-24">
      <TeamSelect teams={teams} />
    </main>
  )
}
