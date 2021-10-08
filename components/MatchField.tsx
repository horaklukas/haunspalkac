import { Label, Icon, Popup } from "semantic-ui-react";
import { useField } from "./FieldsProvider";

interface Props {
  fieldId: string;
}

const MatchField = ({ fieldId }: Props) => {
  const fieldData = useField(fieldId);

  const label = (
    <Label style={{ alignSelf: "flex-start" }}>
      <Icon name="map marker alternate" />
      {fieldData ? fieldData.name : fieldId}
    </Label>
  );

  if (!fieldData) {
    return label;
  }

  return <Popup content={fieldData.info} trigger={label} />;
};

export default MatchField;
