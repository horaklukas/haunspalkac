"use client";

import { format } from "date-fns-tz";

interface MatchTimeProps {
  date: Date;
}

export const MatchTime = ({ date }: MatchTimeProps) => {
  return (
    <span className="text-sm text-slate-400">
      {format(date, "HH:mm", {
        timeZone: "Europe/Prague",
      })}
    </span>
  );
};
