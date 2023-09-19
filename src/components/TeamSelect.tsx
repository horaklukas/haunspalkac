'use client'

import { Combobox } from "@/components/ui/Combobox";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useRef, useState } from "react";
import { TeamDataMap } from "@/lib/scrapper";
import orderBy from "lodash/orderBy";
import { useTranslations } from 'next-intl';

type TeamSelectProps = {
  teams: TeamDataMap;
}

export default function TeamSelect({ teams }: TeamSelectProps) {
  const [team, setTeam] = useState<string>('')

  const t = useTranslations('teamSelect');

  const teamsList = Array.from(teams, ([id, data]) => ({ value: id, label: data.label }))
  const teamsOptions = orderBy(teamsList, ["label"], "asc")

  return (
    <>
      <Combobox
        value={team}
        onChange={setTeam}
        options={teamsOptions}
        placeholder={t('placeholder')}
        emptyText={t('empty')}
      />

      <Link href={`/${team}`} passHref>
        <Button variant="outline" disabled={!team}>{t('submit')}</Button>
      </Link>
    </>
  );
}
