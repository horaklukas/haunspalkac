import { Grid, Header, GridColumn, Divider } from "semantic-ui-react";

import type { MatchData } from "lib/scrapper";
import MatchDate from "./MatchDate";
import FieldName from "./FieldName";
import FieldDetail from "./FieldDetail";

interface Props {
  match: MatchData;
}

const NextMatch = ({ match }: Props) => {
  return (
    <div style={{ textAlign: "center" }}>
      <Header as="h4" style={{ marginBottom: "1em" }}>
        <MatchDate date={match.date} />
      </Header>

      <Grid padded="vertically">
        <GridColumn verticalAlign="middle" textAlign="right" width={7}>
          <Header as="span" size="huge">
            {match.teams.home}
          </Header>
        </GridColumn>
        <GridColumn verticalAlign="middle" textAlign="center" width={2}>
          vs.
        </GridColumn>
        <GridColumn verticalAlign="middle" textAlign="left" width={7}>
          <Header as="span" size="huge">
            {match.teams.away}
          </Header>
        </GridColumn>
      </Grid>

      <div style={{ margin: "1em" }}>
        <FieldName fieldId={match.field} />
      </div>
      <FieldDetail fieldId={match.field} />
    </div>
  );
};

export default NextMatch;
