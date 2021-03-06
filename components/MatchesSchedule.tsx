import React, { useState } from "react";

import { Placeholder, Segment } from "semantic-ui-react";
import Match from "components/Match";
import NextMatch from "components/NextMatch";
import type { MatchSchedule } from "lib/scrapper";
import { useTranslation } from "next-i18next";

import styles from "./MatchesSchedule.module.css";

const matchPlaceholder = (
  <Segment>
    <Placeholder fluid>
      <Placeholder.Line length="short" />
      <Placeholder.Line length="long" />
      <Placeholder.Line length="short" />
    </Placeholder>
  </Segment>
);

interface Props {
  isLoading: boolean;
  schedule: MatchSchedule;
}

const MatchesSchedule = ({ isLoading, schedule }: Props) => {
  const { t } = useTranslation("team-detail");
  const [expandedMatch, setExpandedMatch] = useState<number>(null);

  return (
    <>
      {isLoading && (
        <>
          {matchPlaceholder}
          {matchPlaceholder}
          {matchPlaceholder}
        </>
      )}

      {schedule?.length > 0 &&
        schedule.map((match, index) =>
          index === 0 ? (
            <React.Fragment key={match.date}>
              <div className={styles.nextMatchTitle}>{t("next-match")}</div>
              <Segment className={styles.nextMatch}>
                <NextMatch match={match} />
              </Segment>
            </React.Fragment>
          ) : (
            <Segment
              key={match.date}
              style={{ cursor: "pointer" }}
              onClick={() => {
                setExpandedMatch(index === expandedMatch ? null : index);
              }}
            >
              <Match match={match} showDetail={index === expandedMatch} />
            </Segment>
          )
        )}
    </>
  );
};

export default MatchesSchedule;
