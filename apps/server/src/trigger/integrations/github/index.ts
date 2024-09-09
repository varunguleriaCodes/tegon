import {
  IntegrationEventPayload,
  IntegrationPayloadEventType,
} from '@tegonhq/types';
import { task } from '@trigger.dev/sdk/v3';

import { integrationCreate } from './account-create';
import { getToken } from './get-token';
import { spec } from './spec';

async function run(eventPayload: IntegrationEventPayload) {
  switch (eventPayload.event) {
    case IntegrationPayloadEventType.SPEC:
      return spec();

    // Used to save settings data
    case IntegrationPayloadEventType.CREATE:
      return await integrationCreate(
        eventPayload.userId,
        eventPayload.workspaceId,
        eventPayload.data,
      );

    case IntegrationPayloadEventType.GET_IDENTIFIER:
      return eventPayload.data.eventBody.installation.id.toString();

    case IntegrationPayloadEventType.GET_TOKEN:
      return await getToken(eventPayload.integrationAccountId);

    default:
      return {
        message: `The event payload type is ${eventPayload.event}`,
      };
  }
}

export const githubHandler = task({ id: 'github', run });
