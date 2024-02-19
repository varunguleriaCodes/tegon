/* eslint-disable react-hooks/exhaustive-deps */
/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { useRouter } from 'next/router';
import * as React from 'react';

import { TeamType } from 'common/types/team';

import { useTeamStore } from 'store/team';

export function useTeam(): TeamType | undefined {
  const { query } = useRouter();
  const teamStore = useTeamStore();
  console.log(teamStore);

  const getTeam = () => {
    if (!query.teamIdentifier) {
      return undefined;
    }

    return teamStore.teams.find(
      (team: TeamType) => team.identifier === query.teamIdentifier,
    );
  };

  const team = React.useMemo(() => getTeam(), [query.teamIdentifier]);

  console.log(team);
  return team;
}
