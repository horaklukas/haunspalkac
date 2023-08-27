import { Label, Popup } from "semantic-ui-react";

import type { MatchData } from "lib/scrapper";
import MatchDate from "./MatchDate";
import FieldName from "./FieldName";
import FieldDetail from "./FieldDetail";
import MatchTeams from "./MatchTeams";

import styles from "./Match.module.css";

interface Props {
  match: MatchData;
  showDetail: boolean;
}

const Match = ({ match, showDetail }: Props) => {
  return (
    <div className={styles.container}>
      <Label className={styles.label}>
        <MatchDate date={match.date} />
      </Label>

      <MatchTeams teams={match.teams} showStatistics={showDetail} />

      <Label className={styles.label}>
        <FieldName fieldId={match.field} />
      </Label>

      {showDetail && (
        <div className={styles.fieldDetail}>
          <FieldDetail fieldId={match.field} />
        </div>
      )}
    </div>
  );
};

export default Match;
