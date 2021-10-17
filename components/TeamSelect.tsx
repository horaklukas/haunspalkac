import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { Dropdown, Button, Form, Dimmer, Loader } from "semantic-ui-react";
import { useRouter } from "next/router";
import { kebabCase } from "lodash";
import { useTranslation } from "next-i18next";

import type { TeamFormData } from "lib/scrapper";
import { useStorage } from "lib/hooks";

enum LoaderState {
  RESTORING = "restoring",
  REDIRECTING = "redirecting",
  HIDDEN = "hidden",
}

const useStoredTeam = () => {
  const router = useRouter();
  const [loaderState, setLoaderState] = useState<LoaderState>(
    LoaderState.RESTORING
  );

  const storage = useStorage();
  const storeTeamId = (id: string) => storage.set({ team: { id } });

  const id = storage.data?.team?.id;

  useEffect(() => {
    if (id) {
      setLoaderState(LoaderState.REDIRECTING);
      router.replace(`/team/${id}`);
    } else {
      setLoaderState(LoaderState.HIDDEN);
    }
    // Reason: Just on component mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [loaderState, storeTeamId] as const;
};

const createTeamOption = (team) => ({
  key: team.id,
  value: `${kebabCase(team.label)}-${team.id}`,
  text: team.label,
});

interface Props {
  teams: TeamFormData[];
}

const TeamSelect = ({ teams }: Props) => {
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const options = useMemo(() => teams.map(createTeamOption), [teams]);
  const [loaderState, storeTeamId] = useStoredTeam();
  const { t } = useTranslation("team-select");

  return (
    <Form>
      <Loader active={loaderState !== LoaderState.HIDDEN}>
        {t(`loader-${loaderState}`)}
      </Loader>

      <Form.Field>
        <Dropdown
          placeholder={t("choose-team")}
          search
          deburr
          selection
          options={options}
          onChange={(_, data) => setSelectedTeamId(data.value)}
          noResultsMessage={t("no-team-found")}
        />
      </Form.Field>

      {
        <Link href={`/team/${selectedTeamId}`} passHref>
          <Button
            as="a"
            disabled={!selectedTeamId}
            onClick={() => storeTeamId(selectedTeamId)}
          >
            {t("select-team")}
          </Button>
        </Link>
      }
    </Form>
  );
};

export default TeamSelect;
