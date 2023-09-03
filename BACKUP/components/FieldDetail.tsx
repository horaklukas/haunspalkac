import { Icon, Button } from "semantic-ui-react";
import { useTranslation } from "next-i18next";
import { useState } from "react";

import { useField } from "./FieldsProvider";

import styles from "./FieldDetail.module.css";

interface Props {
  fieldId: string;
  expandable?: boolean;
}

const FieldDetail = ({ fieldId, expandable = false }: Props) => {
  const { t } = useTranslation("team-detail");

  // If not expandable, it's always expanded
  const defaultExpanded = expandable ? false : true;
  const [expanded, setInfoExpanded] = useState(defaultExpanded);
  const toggleExpand = () => setInfoExpanded(!expanded);

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
        onClick={expandable ? toggleExpand : null}
      >
        {fieldData.info}
      </p>
    </>
  );
};

export default FieldDetail;
