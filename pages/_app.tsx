import type { AppProps } from "next/app";
import { Layout } from "../components";

import "semantic-ui-css/semantic.min.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
