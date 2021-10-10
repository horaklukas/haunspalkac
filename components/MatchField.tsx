import { Label, Icon, Popup, Button } from "semantic-ui-react";
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

  return (
    <Popup
      content={
        <>
          <p style={{ textAlign: "center" }}>
            <Button
              icon
              labelPosition="right"
              as="a"
              href={fieldData.link}
              target="_blank"
              color="teal"
            >
              Show on map
              <Icon name="map" />
            </Button>
          </p>
          <p>{fieldData.info}</p>
        </>
      }
      trigger={label}
      on="click"
    />
  );
};

export default MatchField;
