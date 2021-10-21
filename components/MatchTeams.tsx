import React from "react";
import { Grid, Header, GridColumn } from "semantic-ui-react";

import type { MatchData } from "lib/scrapper";

import TeamStatistics from "./TeamStatistics";
import styles from "./MatchTeams.module.css";

interface Props extends Pick<MatchData, "teams"> {
  size?: "medium" | "huge";
  showStatistics?: boolean;
}

const MatchTeams = ({
  teams,
  size = "medium",
  showStatistics = false,
}: Props) => {
  return (
    <Grid className={styles.teams} container>
      <GridColumn
        verticalAlign="middle"
        className={styles.home}
        mobile={16}
        computer={7}
      >
        <div className={styles.wrapper}>
          <Header as="span" size={size} className={styles.name}>
            {teams.home}
          </Header>
          {showStatistics && <TeamStatistics teamName={teams.home} />}
        </div>
      </GridColumn>
      <GridColumn
        verticalAlign="middle"
        className={styles.separator}
        mobile={16}
        computer={2}
      >
        vs.
      </GridColumn>
      <GridColumn
        verticalAlign="middle"
        className={styles.away}
        mobile={16}
        computer={7}
      >
        <div className={styles.wrapper}>
          <Header as="span" size={size} className={styles.name}>
            {teams.away}
          </Header>
          {showStatistics && <TeamStatistics teamName={teams.away} />}
        </div>
      </GridColumn>
    </Grid>
  );
};

export default MatchTeams;
