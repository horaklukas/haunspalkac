import { Header } from "semantic-ui-react";

import type { MatchData } from "lib/scrapper";
import MatchDate from "./MatchDate";
import FieldName from "./FieldName";
import FieldDetail from "./FieldDetail";
import MatchTeams from "./MatchTeams";

interface Props {
  match: MatchData;
}

const NextMatch = ({ match }: Props) => {
  return (
    <div style={{ textAlign: "center" }}>
      <Header as="h4" style={{ marginBottom: "1em" }}>
        <MatchDate date={match.date} />
      </Header>

      <MatchTeams teams={match.teams} size="huge" />

      <div style={{ margin: "1em" }}>
        <FieldName fieldId={match.field} />
      </div>
      <FieldDetail fieldId={match.field} />
    </div>
  );
};

export default NextMatch;
