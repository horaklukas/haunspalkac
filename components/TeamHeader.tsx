import React from "react";
import { Placeholder, Menu, Icon, Button } from "semantic-ui-react";
import Link from "next/link";

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
  return (
    <Menu>
      <Menu.Item header>{team}</Menu.Item>
      <Menu.Item style={{ cursor: "pointer" }}>
        <Link href="/">
          <Icon name="edit" />
        </Link>
      </Menu.Item>
    </Menu>
  );
};

export default TeamHeader;
