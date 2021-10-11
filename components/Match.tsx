import { Label, Popup } from "semantic-ui-react";

import type { MatchData } from "lib/scrapper";
import MatchDate from "./MatchDate";
import FieldName from "./FieldName";
import FieldDetail from "./FieldDetail";
import MatchTeams from "./MatchTeams";

import styles from "./Match.module.css";

interface Props {
  match: MatchData;
}

const Match = ({ match }: Props) => {
  return (
    <div className={styles.container}>
      <Label>
        <MatchDate date={match.date} />
      </Label>

      <MatchTeams teams={match.teams} />

      <Popup
        content={<FieldDetail fieldId={match.field} />}
        trigger={
          <Label>
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
