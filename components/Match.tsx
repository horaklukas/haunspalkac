import { Grid, Header, GridColumn } from "semantic-ui-react";

import type { FieldData, MatchData } from "../lib/scrapper";
import MatchDate from "./MatchDate";
import MatchField from "./MatchField";

interface Props {
  match: MatchData;
  fields: Record<string, FieldData>;
}

const Match = ({ match, fields }: Props) => {
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <MatchDate date={match.date} />

      <Grid style={{ flexGrow: 1 }} padded="vertically">
        <GridColumn verticalAlign="middle" textAlign="right" width={7}>
          <Header as="span" size="huge">
            {match.teams.home}
          </Header>
        </GridColumn>
        <GridColumn verticalAlign="middle" textAlign="center" width={1}>
          vs.
        </GridColumn>
        <GridColumn verticalAlign="middle" textAlign="left" width={8}>
          <Header as="span" size="huge">
            {match.teams.away}
          </Header>
        </GridColumn>
      </Grid>

      <MatchField field={fields[match.field] ?? match.field} />
    </div>
  );
};

export default Match;
