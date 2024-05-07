/** Copyright (c) 2024, Tegon, all rights reserved. **/

export enum LinkedIssueSubType {
  GithubIssue = 'GithubIssue',
  GithubPullRequest = 'GithubPullRequest',
  ExternalLink = 'ExternalLink',
  Slack = 'Slack',
  Sentry = 'Sentry',
}

export enum LinkedSlackMessageType {
  Message = 'Message',
  Thread = 'Thread',
}

export enum Integration {
  Slack = 'Slack',
  Github = 'Github',
  Sentry = 'Sentry',
}

export interface LinkedIssueType {
  id: string;
  createdAt: string;
  updatedAt: string;

  url: string;
  sourceId?: string;
  source: string;
  sourceData: string;
  issueId: string;
  createdById: string;
}
