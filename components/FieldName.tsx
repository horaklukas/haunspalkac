import { Icon } from "semantic-ui-react";
import { useField } from "./FieldsProvider";

interface Props {
  fieldId: string;
}

const FieldName = ({ fieldId }: Props) => {
  const fieldData = useField(fieldId);

  return (
    <>
      <Icon name="map marker alternate" />
      {fieldData ? fieldData.name : fieldId}
    </>
  );
};

export default FieldName;
