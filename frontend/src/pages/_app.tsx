/** Copyright (c) 2024, Tegon, all rights reserved. **/

import 'styles/globals.css';
import type { NextComponentType } from 'next';
import type { AppContext, AppInitialProps, AppLayoutProps } from 'next/app';

import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import React from 'react';
import { HotkeysProvider } from 'react-hotkeys-hook';
import { Hydrate, QueryClientProvider } from 'react-query';
import { SuperTokensWrapper } from 'supertokens-auth-react';

import { initSuperTokens } from 'common/init-config';
import { useGetQueryClient } from 'common/lib/react-query-client';
import { cn } from 'common/lib/utils';
import { SCOPES } from 'common/scopes';

import { ThemeProvider } from 'components/theme-provider';
import { Toaster } from 'components/ui/toaster';
import { TooltipProvider } from 'components/ui/tooltip';

import { StoreContext, storeContextStore } from 'store/global-context-provider';

initSuperTokens();

TimeAgo.addDefaultLocale(en);

export const MyApp: NextComponentType<
  AppContext,
  AppInitialProps,
  AppLayoutProps
> = ({
  Component,
  pageProps: { dehydratedState, ...pageProps },
}: AppLayoutProps) => {
  const queryClientRef = useGetQueryClient();
  const getLayout = Component.getLayout || ((page: React.ReactNode) => page);

  return (
    <SuperTokensWrapper>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <HotkeysProvider initiallyActiveScopes={[SCOPES.Global]}>
          <TooltipProvider delayDuration={1000}>
            <StoreContext.Provider value={storeContextStore}>
              <QueryClientProvider client={queryClientRef.current}>
                <Hydrate state={dehydratedState}>
                  <div
                    className={cn(
                      'min-h-screen font-sans antialiased flex',
                      GeistSans.variable,
                      GeistMono.variable,
                    )}
                  >
                    {getLayout(<Component {...pageProps} />)}
                  </div>

                  <Toaster />
                </Hydrate>
              </QueryClientProvider>
            </StoreContext.Provider>
          </TooltipProvider>
        </HotkeysProvider>
      </ThemeProvider>
    </SuperTokensWrapper>
  );
};

export default MyApp;
