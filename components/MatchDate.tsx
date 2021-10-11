import { intlFormat } from "date-fns";
import { Icon } from "semantic-ui-react";

interface Props {
  date: string;
}

const MatchDate = ({ date }: Props) => {
  return (
    <>
      <Icon name="calendar alternate outline" />{" "}
      {intlFormat(
        new Date(date),
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
    </>
  );
};

export default MatchDate;
