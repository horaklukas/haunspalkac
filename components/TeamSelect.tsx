import Link from "next/link";
import { useMemo, useState } from "react";
import { Dropdown, Button, Form } from "semantic-ui-react";

import type { TeamFormData } from "lib/scrapper";

interface Props {
  teams: TeamFormData[];
}

const TeamSelect = ({ teams }: Props) => {
  const options = useMemo(
    () =>
      teams.map((team) => ({
        key: team.id,
        value: team.id,
        text: team.label,
      })),
    [teams]
  );
  const [teamId, setTeamId] = useState(null);

  if (teams.length === 0) {
    <>Sorry no data</>;
  }

  return (
    <Form>
      <Form.Field>
        <Dropdown
          placeholder="Choose your team"
          search
          selection
          options={options}
          onChange={(_, data) => setTeamId(data.value)}
        />
      </Form.Field>

      {
        <Link href={`/team/${teamId}`} passHref>
          <Button as="a" disabled={!teamId}>
            Select team
          </Button>
        </Link>
      }
    </Form>
  );
};

export default TeamSelect;
