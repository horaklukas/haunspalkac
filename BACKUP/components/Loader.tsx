import { Loader as SemUiLoader, Icon } from "semantic-ui-react";
import type { LoaderProps } from "semantic-ui-react";

const Loader = (props: LoaderProps) => {
  return <SemUiLoader {...props} as="span" />;
};

export default Loader;
