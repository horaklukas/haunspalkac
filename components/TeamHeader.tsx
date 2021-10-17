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
      <Menu.Item style={{ cursor: "pointer" }} onClick={storage.reset}>
        <Link href="/">
          <Icon name="edit" />
        </Link>
      </Menu.Item>
    </Menu>
  );
};

export default TeamHeader;
