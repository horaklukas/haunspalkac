import { formatInTimeZone } from "date-fns-tz";

interface MatchTimeProps {
  date: Date;
}

export const MatchTime = ({ date }: MatchTimeProps) => {
  return (
    <span className="text-sm text-slate-400">
      {formatInTimeZone(date, "Europe/Prague", "HH:mm")}
    </span>
  );
};
