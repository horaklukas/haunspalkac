import { Loader } from "@/components/ui/Loader";
import { useTranslations } from "next-intl";

export default function HomeLoading() {
  const t = useTranslations('app')

  return (
    <main className="flex items-center justify-center min-h-screen p-24">
      <Loader />
      <small className="text-sm">{t('loading')}</small>

    </main>
  );
}
