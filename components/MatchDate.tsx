import { intlFormat } from "date-fns";
import { Icon } from "semantic-ui-react";
import type { MatchData } from "lib/scrapper";
import { useTranslation } from "next-i18next";

interface Props {
  date: MatchData["date"];
}

const MatchDate = ({ date }: Props) => {
  const refDate = new Date(date);
  const { i18n } = useTranslation("team-detail");

  return (
    <>
      <Icon
        name="calendar alternate outline"
        style={{ display: "inline-block" }}
      />
      <span style={{ display: "inline-flex", flexDirection: "column" }}>
        <span>
          {intlFormat(
            refDate,
            {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            },
            {
              locale: i18n.language,
            }
          )}
        </span>
        {intlFormat(
          refDate,
          {
            hour: "numeric",
            minute: "numeric",
          },
          {
            locale: i18n.language,
          }
        )}
      </span>
    </>
  );
};

export default MatchDate;
