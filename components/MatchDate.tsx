import { intlFormat } from "date-fns";
import { Label, Icon } from "semantic-ui-react";

interface Props {
  date: string;
}

const MatchDate = ({ date }: Props) => {
  return (
    <Label style={{ alignSelf: "flex-start" }}>
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
    </Label>
  );
};

export default MatchDate;
