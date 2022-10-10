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

export interface CommitsModel {
  sha: string;
  node_id: string;
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
    committer: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
    tree: {
      sha: string;
      url: string;
    };
    url: string;
    comment_count: number;
    verification: {
      verified: false;
      reason: string;
      signature: unknown;
      payload: unknown;
    };
  };
  url: string;
  html_url: string;
  comments_url: string;
  author: unknown;
  committer: unknown;
  parents: {
    sha: string;
    url: string;
    html_url: string;
  }[];
}
