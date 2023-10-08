import { TeamInfo } from "@/lib/scrapper";
import { getTeamUrl } from "@/utils";

interface TeamNameProps {
  team?: TeamInfo;
}

export const TeamName = ({ team }: TeamNameProps) => {
  if (!team) {
    return null;
  }

  const { urlPath, label } = team;

  return (
    <a
      className="text-xl hover:text-yellow-600"
      href={getTeamUrl(urlPath)}
      target="_blank"
      rel="noopener noreferrer"
    >
      {label}
    </a>
  );
};
