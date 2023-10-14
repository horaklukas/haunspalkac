import { formatMatchTime } from "@/utils";

interface MatchTimeProps {
  date: Date;
}

export const MatchTime = ({ date }: MatchTimeProps) => {
  return (
    <span className="text-sm text-slate-400">
      {formatMatchTime(date)}
    </span>
  );
};
