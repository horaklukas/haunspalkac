import { Grid, Header, GridColumn, Label, Popup } from "semantic-ui-react";

import type { MatchData } from "lib/scrapper";
import MatchDate from "./MatchDate";
import FieldName from "./FieldName";
import FieldDetail from "./FieldDetail";

interface Props {
  match: MatchData;
}

const Match = ({ match }: Props) => {
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <Label style={{ alignSelf: "flex-start" }}>
        <MatchDate date={match.date} />
      </Label>

      <Grid style={{ flexGrow: 1 }}>
        <GridColumn verticalAlign="middle" textAlign="right" width={7}>
          <Header as="span" size="medium">
            {match.teams.home}
          </Header>
        </GridColumn>
        <GridColumn verticalAlign="middle" textAlign="center" width={1}>
          vs.
        </GridColumn>
        <GridColumn verticalAlign="middle" textAlign="left" width={8}>
          <Header as="span" size="medium">
            {match.teams.away}
          </Header>
        </GridColumn>
      </Grid>

      <Popup
        content={<FieldDetail fieldId={match.field} />}
        trigger={
          <Label style={{ alignSelf: "flex-start" }}>
            <FieldName fieldId={match.field} />
          </Label>
        }
        on="click"
        position="left center"
      />
    </div>
  );
};

export default Match;
