import { Icon, Button } from "semantic-ui-react";
import { useTranslation } from "next-i18next";
import { useState } from "react";

import { useField } from "./FieldsProvider";

import styles from "./FieldDetail.module.css";

interface Props {
  fieldId: string;
}

const FieldDetail = ({ fieldId }: Props) => {
  const { t } = useTranslation("team-detail");
  const [expanded, setInfoExpanded] = useState(false);
  const fieldData = useField(fieldId);

  if (!fieldData) {
    return null;
  }

  return (
    <>
      <p className={styles.buttonWrapper}>
        <Button
          icon
          labelPosition="right"
          as="a"
          href={fieldData.link}
          target="_blank"
          color="teal"
          basic
        >
          {t("show-field-on-map")}
          <Icon name="map" className={styles.icon} />
        </Button>
      </p>
      <p
        className={[styles.info, expanded && styles.expanded]
          .filter(Boolean)
          .join(" ")}
        onClick={() => setInfoExpanded(!expanded)}
      >
        {fieldData.info}
      </p>
    </>
  );
};

export default FieldDetail;
