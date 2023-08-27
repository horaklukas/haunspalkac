import React from "react";
import { Placeholder, Menu, Icon } from "semantic-ui-react";
import Link from "next/link";

import { useStorage } from "lib/hooks";
import { PSMF_URL } from "lib/scrapper/config";

export const placeholder = (
  <Placeholder>
    <Placeholder.Header>
      <Placeholder.Line />
    </Placeholder.Header>
  </Placeholder>
);

interface Props {
  team: string;
  webUrl: string;
}

const TeamHeader = ({ team, webUrl }: Props) => {
  const storage = useStorage();

  return (
    <Menu>
      <Menu.Item header>{team}</Menu.Item>

      <Link href="/" passHref>
        <Menu.Item onClick={storage.reset}>
          <Icon name="edit" />
        </Menu.Item>
      </Link>

      <Menu.Item href={PSMF_URL + webUrl} target="_blank">
        <Icon name="external" />
        PSMF
      </Menu.Item>
    </Menu>
  );
};

export default TeamHeader;
