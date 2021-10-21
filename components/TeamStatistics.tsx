import { useTeamStatistics } from "./TeamsStatisticsProvider";

import styles from "./TeamStatistics.module.css";

interface Props {
  teamName: string;
}

const TeamStatistics = ({ teamName }: Props) => {
  const statistics = useTeamStatistics(teamName);

  if (!statistics) {
    return null;
  }

  return (
    <p className={styles.statistic}>
      <span>{statistics.order}.</span>
      <span className={styles.divider} />
      <span>{statistics.score}</span>
    </p>
  );
};

export default TeamStatistics;
