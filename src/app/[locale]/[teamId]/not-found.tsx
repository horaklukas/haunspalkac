import Link from "next/link";

import { useTranslations } from "next-intl";

export default function TeamDetailNotFound() {
  const t = useTranslations('error')

  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-3 p-24">
      <span className="text-3xl">🤚</span>
      <div role="alert">
        {t.rich('teamNotFound', {
          searchLink: (chunks) => <Link href="/" className="text-orange-300 hover:underline">{chunks}</Link>,
        })}
      </div>
    </main>
  );
}
