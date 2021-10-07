import type { PropsWithChildren } from "react";

type Props = PropsWithChildren<{}>;

const Layout = ({ children }: Props) => {
  return <main>{children}</main>;
};

export default Layout;
