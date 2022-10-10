import { RequestedReviewers, PullRequestDetails } from '../model';

export function mapRepositories(repositories: any[]) {
  return repositories.map((repo) => ({
    id: repo.id,
    name: repo.name,
    nodeId: repo.node_id,
    private: repo.private,
    url: repo.html_url,
  }));
}

export function mapPullRequests(pullRequests: any[]): PullRequestDetails[] {
  return pullRequests.map((pullRequest) => ({
    id: pullRequest.id,
    updatedAt: pullRequest.updated_at,
    createdAt: pullRequest.created_at,
    nodeId: pullRequest.node_id,
    title: pullRequest.title,
    url: pullRequest.html_url,
    number: pullRequest.number,
    state: pullRequest.state,
    author: {
      name: pullRequest.assignee?.login,
      avatarUrl: pullRequest.assignee?.avatar_url,
      nodeId: pullRequest.assignee?.node_id,
      id: pullRequest.assignee?.id,
    },
    description: pullRequest.body,
    isDraft: pullRequest.draft,
    requestedReviewers: pullRequest.requested_reviewers?.map((reviews: any) => ({
      id: reviews.id,
      nodeId: reviews.node_id,
      user: reviews.login,
      avatar: reviews.avatar_url,
    })),
    requestedTeams: pullRequest.requested_teams?.map((team: any) => ({
      id: team.id,
      nodeId: team.node_id,
      name: team.name,
    })),
  }));
}

export function mapRequestedReviewers(pullNumber: number, data: any): RequestedReviewers {
  return {
    pullNumber,
    users: (data.users ?? []).map((user: any) => ({
      name: user?.login,
      id: user?.id,
      nodeId: user?.node_id,
      avatarUrl: user?.avatar_url,
    })),
    team: (data.teams ?? []).map((team: any) => ({
      id: team?.id,
      nodeId: team?.node_id,
      name: team?.name,
    })),
  };
}

export function mapReviewersInPullRequest(pullNumber: number, data: any[]) {
  return {
    pullNumber,
    reviewers: data.map((review) => ({
      id: review.id,
      nodeId: review.node_id,
      user: {
        id: review.user?.id,
        nodeId: review.user?.node_id,
        name: review.user?.login,
        avatarUrl: review.user?.avatar_url,
      },
      state: review.state,
      comment: review.body,
    })),
  };
}
