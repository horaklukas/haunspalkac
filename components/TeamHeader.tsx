import React from "react";
import { Placeholder, Menu, Icon } from "semantic-ui-react";
import Link from "next/link";

import { useStorage } from "lib/hooks";

export const placeholder = (
  <Placeholder>
    <Placeholder.Header>
      <Placeholder.Line />
    </Placeholder.Header>
  </Placeholder>
);

interface Props {
  team: string;
}

const TeamHeader = ({ team }: Props) => {
  const storage = useStorage();

  return (
    <Menu>
      <Menu.Item header>{team}</Menu.Item>

      <Link href="/" passHref>
        <Menu.Item style={{ cursor: "pointer" }} onClick={storage.reset}>
          <Icon name="edit" />
        </Menu.Item>
      </Link>
    </Menu>
  );
};

export default TeamHeader;
