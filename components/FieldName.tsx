import { Icon } from "semantic-ui-react";
import { useField } from "./FieldsProvider";

import styles from "./FieldName.module.css";

interface Props {
  fieldId: string;
}

const FieldName = ({ fieldId }: Props) => {
  const fieldData = useField(fieldId);

  return (
    <>
      <Icon name="map marker alternate" />
      <span className={styles.textLayout}>
        <span>{fieldData && fieldData.name}</span>
        <span className={styles.id}>{fieldId}</span>
      </span>
    </>
  );
};

export default FieldName;
