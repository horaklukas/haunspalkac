import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { NextIntlClientProvider, useTranslations } from 'next-intl';
import { ErrorBoundary } from "react-error-boundary";

import '@/styles/global.css'
import { notFound } from 'next/navigation';
import { getTranslator } from 'next-intl/server';

const inter = Inter({ subsets: ['latin'] })

type RootLayoutProps = {
  children: React.ReactNode,
  params: { locale: 'cs' | 'en' }
}


export async function generateMetadata({
  params: { locale }
}: Omit<RootLayoutProps, 'children'>): Promise<Metadata> {
  const t = await getTranslator(locale, 'app.seo');

  return {
    title: t('title'),
    description: t('description'),
  };
}

function GeneralError() {
  const t = useTranslations('error')

  return (
    <div role="alert">
      <p>{t('general')}</p>
    </div>
  );
}

export default async function RootLayout({
  children,
  params: { locale }
}: RootLayoutProps) {
  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body className={`${inter.className} dark`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ErrorBoundary fallback={<GeneralError />}>
            {children}
          </ErrorBoundary>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
