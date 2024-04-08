/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import * as React from 'react';

import { cn } from 'common/lib/utils';
import { AllProviders } from 'common/wrappers/all-providers';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from 'components/ui/resizable';
import { FocusLine, Inbox, SettingsLine } from 'icons';

import { useContextStore } from 'store/global-context-provider';

import { Header } from './header';
import { Nav } from './nav';
import { TeamList } from './team-list';

interface LayoutProps {
  defaultCollapsed?: boolean;
  children: React.ReactNode;
}

export const AppLayoutChild = observer(({ children }: LayoutProps) => {
  const { applicationStore, notificationsStore } = useContextStore();
  const isCollapsed = applicationStore.displaySettings.sidebarCollapsed;
  const {
    query: { workspaceSlug },
  } = useRouter();

  return (
    <div className="md:flex flex-col flex-grow">
      <div className="hidden md:block h-full">
        <ResizablePanelGroup
          direction="horizontal"
          onLayout={(sizes: number[]) => {
            document.cookie = `react-resizable-panels:layout=${JSON.stringify(
              sizes,
            )}`;
          }}
          className="h-full max-h-[100vh] items-stretch max-w-[100vw]"
        >
          <ResizablePanel
            defaultSize={14}
            collapsible
            collapsedSize={0}
            minSize={14}
            maxSize={14}
            onExpand={() => {
              applicationStore.updateDisplaySettings({
                sidebarCollapsed: false,
              });
              document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
                false,
              )}`;
            }}
            onCollapse={() => {
              applicationStore.updateDisplaySettings({
                sidebarCollapsed: true,
              });
              document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
                true,
              )}`;
            }}
            className={cn(
              isCollapsed && 'transition-all duration-300 ease-in-out',
            )}
          >
            {!isCollapsed && (
              <>
                <Header />
                <Nav
                  links={[
                    {
                      title: 'Inbox',
                      icon: Inbox,
                      href: `/${workspaceSlug}/inbox`,
                      count: notificationsStore.unReadCount,
                    },
                    {
                      title: 'My issues',
                      icon: FocusLine,
                      href: `/${workspaceSlug}/my-issues`,
                    },
                    {
                      title: 'Settings',
                      icon: SettingsLine,
                      href: `/${workspaceSlug}/settings/overview`,
                    },
                  ]}
                />

                <TeamList />
              </>
            )}
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel minSize={30}>{children}</ResizablePanel>
        </ResizablePanelGroup>
      </div>

      <div className="px-4 flex md:hidden pt-4"> {children} </div>
    </div>
  );
});

export function AppLayout(props: LayoutProps) {
  return (
    <AllProviders>
      <AppLayoutChild {...props} />
    </AllProviders>
  );
}
