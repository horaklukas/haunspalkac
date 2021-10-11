import React from "react";
import { Grid, Header, GridColumn } from "semantic-ui-react";

import type { MatchData } from "lib/scrapper";
import styles from "./MatchTeams.module.css";

interface Props extends Pick<MatchData, "teams"> {
  size?: "medium" | "huge";
}

const MatchTeams = ({ teams, size = "medium" }: Props) => {
  return (
    <Grid className={styles.teams} container>
      <GridColumn
        verticalAlign="middle"
        className={styles.home}
        mobile={16}
        computer={7}
      >
        <Header as="span" size={size}>
          {teams.home}
        </Header>
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
        <Header as="span" size={size}>
          {teams.away}
        </Header>
      </GridColumn>
    </Grid>
  );
};

export default MatchTeams;
