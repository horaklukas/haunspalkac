'use client'

import { Combobox } from "@/components/ui/Combobox";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useRef, useState } from "react";
import { TeamDataMap } from "@/lib/scrapper";
import orderBy from "lodash/orderBy";

type TeamSelectProps = {
  teams: TeamDataMap;
}

export default function TeamSelect({ teams }: TeamSelectProps) {
  const [team, setTeam] = useState<string>('')
  

  const teamsList = Array.from(teams, ([id, data]) => ({ value: id, label: data.label }))
  const teamsOptions = orderBy(teamsList, ["label"], "asc")

  return (
    <>
      <Combobox
        value={team}
        onChange={setTeam}
        options={teamsOptions}
        placeholder={"Select team..."}
      />

      <Link href={`/${team}`} passHref>
        <Button variant="outline" disabled={!team}>Confirm team</Button>
      </Link>
    </>
  );
}
