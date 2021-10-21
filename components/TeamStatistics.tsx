import { Icon } from "semantic-ui-react";
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
      <span>
        <Icon name="trophy" className={styles.icon} />
        {statistics.order}.
      </span>
      <span>
        <Icon name="futbol" className={styles.icon} />
        {statistics.score}
      </span>
    </p>
  );
};

export default TeamStatistics;
