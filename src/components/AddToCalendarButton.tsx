"use client";

import { FieldData, TeamInfo } from "@/lib/scrapper";
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
      startTime={format(date, "HH:mm")}
      endTime={format(addMinutes(date, 75), "HH:mm")}
      timeZone="Europe/Prague"
      location={location}
      description={description}
      options={["Apple", "Google", "Outlook.com", "Microsoft365"]}
      hideTextLabelButton
      lightMode="dark"
      size="4|3|2"
    />
  );
};
