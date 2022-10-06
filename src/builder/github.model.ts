export enum GithubUrl {
  ListRepositories = '/orgs/indigotech/repos',
  GetRepository = '/repos/indigotech/{repository}',
  ListPullRequests = '/repos/indigotech/{repository}/pulls',
  ListPullRequestsByUser = '/repos/indigotech/{repository}/{user}',
  GetPullRequestDetails = '/repos/indigotech/{repostory}/pulls/{pullNumber}',
  ListCommitsOnPullRequest = '/repos/indigotech/{repository}/pulls/{pullNumber}/commits',
  ListReviewCommentsOnPullRequest = '/repos/indigotech/{repository}/pulls/{pullNumber}/comments',
  ListRequestedReviewsInPullRequest = '/repos/indigotech/{repository}/pulls/{pullNumber}/requested_reviewers',
  ListReviewersInPullRequest = '/repos/indigotech/{repository}/pulls/{pullNumber}/reviews',
  ListCommitsInRepository = '/repos/indigotech/{repository}/commits',
}
