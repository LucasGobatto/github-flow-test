export function mapRepositories(repositories: any[]) {
  return repositories.map((repo) => ({
    id: repo.id,
    name: repo.name,
    nodeId: repo.node_id,
    private: repo.private,
    url: repo.html_url,
  }));
}

export function mapPullRequests(pullRequests: any[]) {
  return pullRequests.map((pullRequest) => ({
    id: pullRequest.id,
    nodeId: pullRequest.node_id,
    title: pullRequest.title,
    url: pullRequest.url,
    number: pullRequest.number,
    state: pullRequest.state,
    owner: pullRequest.assignee?.login,
    ownerAvatar: pullRequest.assignee?.avatar_url,
    description: pullRequest.body,
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
    isDraft: pullRequest.draft,
  }));
}

export function mapRequestedReviewers(data: any) {
  return {
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

export function mapReviewersInPullRequest(data: any[]) {
  return {
    reviewers: data.map((review) => ({
      id: review.id,
      nodeId: review.node_id,
      user: {
        id: review.user?.id,
        nodeId: review.user?.node_id,
        name: review.user?.login,
      },
      state: review.state,
      comment: review.body,
    })),
  };
}
