import Head from "next/head";
import type { AppProps } from "next/app";
import Layout from "components/Layout";

import "semantic-ui-css/semantic.min.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Head>{/* <link rel="icon" href="/favicon.ico" /> */}</Head>

      <Component {...pageProps} />
    </Layout>
  );
}
