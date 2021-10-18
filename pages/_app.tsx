import Head from "next/head";
import type { AppProps } from "next/app";
import Layout from "components/Layout";
import { appWithTranslation } from "next-i18next";

import "semantic-ui-css/semantic.min.css";

function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Head>{/* <link rel="icon" href="/favicon.ico" /> */}</Head>

      <Component {...pageProps} />
    </Layout>
  );
}

export default appWithTranslation(App);
