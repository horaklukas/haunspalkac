"use client";

import { FieldData, TeamInfo } from "@/lib/scrapper";
import { formatMatchTime } from "@/utils";
import { AddToCalendarButton as AddToCalendarButtonReact } from "add-to-calendar-button-react";
import { addMinutes, format } from "date-fns";
import { useTranslations } from "next-intl";

type AddToCalendarButtonProps = {
  round: number;
  date: Date;
  homeTeam: TeamInfo;
  awayTeam: TeamInfo;
  field?: FieldData
};

export const AddToCalendarButton = ({
  round,
  date,
  homeTeam,
  awayTeam,
  field,
}: AddToCalendarButtonProps) => {
  const t = useTranslations('team')

  const location = field?.address ?? ''
  const description = [
    t('round', { round }),
    field?.info,
    field ? `\n[url]${field?.link}|${field?.link}[/url]` : null
  ].filter(Boolean).join('\n')

  return (
    <AddToCalendarButtonReact
      name={`⚽️ ${homeTeam?.label} vs. ${awayTeam?.label}`}
      startDate={format(date, "yyyy-MM-dd")}
      startTime={formatMatchTime(date)}
      endTime={formatMatchTime(addMinutes(date, 75))}
      
      timeZone="Europe/Prague"
      location={location}
      description={description}
      options={["Apple", "Google", "Outlook.com", "Microsoft365", "iCal"]}
      hideTextLabelButton
      lightMode="dark"
      size="4|3|2"
    />
  );
};
