import { Label, Icon, Popup, Button } from "semantic-ui-react";
import { useField } from "./FieldsProvider";

interface Props {
  fieldId: string;
}

const FieldDetail = ({ fieldId }: Props) => {
  const fieldData = useField(fieldId);

  if (!fieldData) {
    return null;
  }

  return (
    <>
      <p style={{ textAlign: "center" }}>
        <Button
          icon
          labelPosition="right"
          as="a"
          href={fieldData.link}
          target="_blank"
          color="teal"
          basic
        >
          Show on map
          <Icon name="map" style={{ background: "transparent" }} />
        </Button>
      </p>
      <p>{fieldData.info}</p>
    </>
  );
};

export default FieldDetail;
