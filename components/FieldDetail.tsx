import { Icon, Button } from "semantic-ui-react";
import { useField } from "./FieldsProvider";
import { useTranslation } from "next-i18next";

interface Props {
  fieldId: string;
}

const FieldDetail = ({ fieldId }: Props) => {
  const { t } = useTranslation("team-detail");
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
          {t("show-field-on-map")}
          <Icon name="map" style={{ background: "transparent" }} />
        </Button>
      </p>
      <p>{fieldData.info}</p>
    </>
  );
};

export default FieldDetail;
