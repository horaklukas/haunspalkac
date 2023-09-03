"use client";

import { TeamInfo } from "@/lib/scrapper";
import { AddToCalendarButton as AddToCalendarButtonReact } from "add-to-calendar-button-react";
import { addMinutes, format } from "date-fns";

type AddToCalendarButtonProps = {
  round: number;
  date: Date;
  location: string;
  homeTeam: TeamInfo;
  awayTeam: TeamInfo;
};

export const AddToCalendarButton = ({
  round,
  date,
  location,
  homeTeam,
  awayTeam,
}: AddToCalendarButtonProps) => {
  return (
    <AddToCalendarButtonReact
      name={`${round}. ${homeTeam?.label} vs ${awayTeam?.label}`}
      startDate={format(date, "yyyy-MM-dd")}
      startTime={format(date, "HH:mm")}
      endTime={format(addMinutes(date, 75), "HH:mm")}
      location={location}
      options={["Apple", "Google", "Outlook.com", "Microsoft365"]}
      hideTextLabelButton
      lightMode="dark"
      size="4|3|2"
    />
  );
};
