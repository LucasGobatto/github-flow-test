export enum GithubUrl {
  ListRepositories = '/orgs/indigotech/repos',
  GetRepository = '/repos/indigotech/{repository}',
  ListPullRequests = '/repos/indigotech/{repository}/pulls',
  ListPullRequestsByUser = '/repos/indigotech/{repository}/{user}',
  GetPullRequestDetails = '/repos/indigotech/{repository}/pulls/{pullNumber}',
  ListCommitsOnPullRequest = '/repos/indigotech/{repository}/pulls/{pullNumber}/commits',
  ListReviewCommentsOnPullRequest = '/repos/indigotech/{repository}/pulls/{pullNumber}/comments',
  ListRequestedReviewsInPullRequest = '/repos/indigotech/{repository}/pulls/{pullNumber}/requested_reviewers',
  ListReviewersInPullRequest = '/repos/indigotech/{repository}/pulls/{pullNumber}/reviews',
  ListCommitsInRepository = '/repos/indigotech/{repository}/commits',
  ListAllBranchs = '/repos/indigotech/{repository}/branches',
}

export interface Repository {
  repository: string;
}

interface Author {
  name: string;
  id: string;
  nodeId: string;
  avatarUrl: string;
}

interface Team {
  id: string;
  nodeId: string;
  name: string;
}

export interface PullRequestDetails {
  id: string;
  updatedAt: string;
  createdAt: string;
  nodeId: string;
  title: string;
  url: string;
  number: number;
  state: string;
  description: string;
  isDraft: boolean;
  requestedReviewers: RequestedReviewers[];
  requestedTeams: Team[];
  author: Author;
}

interface PullRequestBasicInformation {
  title: string;
  number: number;
  url: string;
}

export interface PullRequestAuthData {
  repository: string;
  pullRequests: PullRequestBasicInformation[];
  author: Author;
  count: number;
}

export interface MergedPullRequestResponse {
  count: number;
  authorData: PullRequestAuthData[];
}

export interface RequestedReviewers {
  pullNumber: number;
  users: Author[];
  team: Team[];
}

export interface Reviewers {
  id: string;
  nodeId: string;
  user: Author;
  state: string;
  comment: string;
}

export interface CodeReviewsStatsResponse {
  requestedReviewer: RequestedReviewers;
  number: number;
  title: string;
  author: Author;
  url: string;
  reviewers: Reviewers[];
}
