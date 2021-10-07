import { Label, Icon, Popup } from "semantic-ui-react";
import type { FieldData } from "../lib/scrapper";

interface Props {
  field: FieldData | string;
}

const MatchField = ({ field }: Props) => {
  const label = (
    <Label style={{ alignSelf: "flex-start" }}>
      <Icon name="map marker alternate" />
      {typeof field === "string" ? field : field.name}
    </Label>
  );

  if (typeof field === "string") {
    return label;
  }

  return <Popup content={field.info} trigger={label} />;
};

export default MatchField;
