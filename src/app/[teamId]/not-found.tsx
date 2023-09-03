import Link from "next/link";

import yellowCard from '../../images/yellow-card.svg'

export default function TeamDetailNotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 p-24">
      <div role="alert">
        Cannot find team detail, try to <Link href="/">search team again</Link>
      </div>
    </main>
  );
}
