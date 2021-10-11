import { intlFormat } from "date-fns";
import { Icon } from "semantic-ui-react";

interface Props {
  date: string;
}

const MatchDate = ({ date }: Props) => {
  const refDate = new Date(date);
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
              locale: "cs-CZ",
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
            locale: "cs-CZ",
          }
        )}
      </span>
    </>
  );
};

export default MatchDate;
