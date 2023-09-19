import { Loader } from "@/components/ui/Loader";
import { useTranslations } from "next-intl";

export default function TeamDetailLoading() {
  const t = useTranslations('team')
  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-5 p-24">
      <Loader />
      <small className="text-sm">{t('loading')}</small>
    </main>
  );
}
