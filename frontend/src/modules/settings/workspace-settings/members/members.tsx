/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';
import React from 'react';

import { SettingSection } from 'modules/settings/setting-section';

import { Button } from 'components/ui/button';
import { Loader } from 'components/ui/loader';
import { useUsersData } from 'hooks/users';

import type { User } from 'store/user-context';

import { AddMemberDialog } from './add-member-dialog';
import { MemberItem } from './member-item';

export const Members = observer(() => {
  const { usersData, isLoading } = useUsersData();
  const [newMemberDialog, setNewMemberDialog] = React.useState(false);

  return (
    <>
      <SettingSection
        title="Members"
        description=" Manage who has access to this workspace"
      >
        <div>
          {isLoading && <Loader />}

          {!isLoading && (
            <div className="flex flex-col">
              <div className="flex justify-between items-center">
                <Button
                  variant="secondary"
                  onClick={() => setNewMemberDialog(true)}
                >
                  Add member
                </Button>
                <h3 className="text-xs"> {usersData.length} Members </h3>
              </div>

              <div className="mt-4 flex flex-col gap-2">
                {usersData.map((userData: User, index) => (
                  <MemberItem
                    key={userData.id}
                    name={userData.fullname}
                    email={userData.email}
                    className={
                      index === usersData.length - 1 && 'pb-0 !border-b-0'
                    }
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </SettingSection>
      {newMemberDialog && (
        <AddMemberDialog setDialogOpen={setNewMemberDialog} />
      )}
    </>
  );
});
