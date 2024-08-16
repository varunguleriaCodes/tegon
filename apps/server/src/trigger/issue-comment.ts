import { PrismaClient } from '@prisma/client';
import {
  ActionEntity,
  ActionTypesEnum,
  ModelNameEnum,
  ReplicationPayload,
} from '@tegonhq/types';
import { task } from '@trigger.dev/sdk/v3';

import { triggerTask } from 'modules/triggerdev/triggerdev.utils';

import {
  convertToActionType,
  getIntegrationAccountsFromActions,
} from './utils';

const prisma = new PrismaClient();
export const issueCommentTrigger = task({
  id: `${ModelNameEnum.IssueComment}-trigger`,
  run: async (payload: ReplicationPayload) => {
    const actionType = payload.isDeleted
      ? ActionTypesEnum.OnDelete
      : convertToActionType(payload.action);

    const issueComment = await prisma.issueComment.findUnique({
      where: { id: payload.modelId },
      include: { parent: true, issue: { include: { team: true } } },
    });

    const workspaceId = issueComment.issue.team.workspaceId;

    const actionEntities = await prisma.actionEntity.findMany({
      where: {
        type: actionType,
        entity: ModelNameEnum.LinkedIssue,
        deleted: null,
        // action: { workspaceId },
      },
      include: {
        action: true,
      },
    });

    if (actionEntities.length < 1) {
      return {
        message: `Couldn't find any action for this entity and type: ${ModelNameEnum.LinkedIssue} ${actionType}`,
      };
    }

    const integrationMap = await getIntegrationAccountsFromActions(
      prisma,
      workspaceId,
      actionEntities,
    );

    const handleIds = await Promise.all(
      actionEntities.map(async (actionEntity: ActionEntity) => {
        const handle = await triggerTask(
          `${actionEntity.action.name}-handler`,
          {
            event: actionType,
            payload: {
              userId: issueComment.userId,
              data: {
                type: ModelNameEnum.IssueComment,
                issueCommentId: issueComment.id,
                integrationAccounts: Object.fromEntries(
                  actionEntity.action.integrations.map((integrationName) => [
                    integrationName,
                    integrationMap[integrationName],
                  ]),
                ),
              },
            },
          },
          payload.actionApiKey,
        );
        return handle.id;
      }),
    );

    return {
      message: `Triggered handler task with ids: ${handleIds}`,
    };
  },
});