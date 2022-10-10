import { Service } from 'typedi';
import { GitHubBuilder } from '../builder/github.builder';
import { CodeReviewsStatsResponse, Repository, ServerResponseModel } from '../model';
import { ONE_DAY_AND_TRHEE_HOURS } from './constants';

@Service()
export class GetNumberOfCodeReviewInPullRequestUseCase {
  constructor(private readonly githubBuilder: GitHubBuilder) {}

  async exec(input: Repository): ServerResponseModel<CodeReviewsStatsResponse[]> {
    const { repository } = input;

    const pullRequests = await this.githubBuilder.getPullRequestsInRepository(repository);
    const newestPullRequest = pullRequests.filter(
      (pr) => new Date(pr.updatedAt).getTime() <= Date.now() - ONE_DAY_AND_TRHEE_HOURS,
    );

    const pullRequestsData = newestPullRequest.map((pr) => ({
      number: pr.number,
      title: pr.title,
      author: pr.author,
      url: pr.url,
    }));
    const promises = pullRequestsData.map(({ number }) =>
      this.githubBuilder.getAllReviewersInPullRequest(repository, number),
    );
    const codeReviews = await Promise.all(promises);
    const requestedReviewersPromises = pullRequestsData.map(({ number }) =>
      this.githubBuilder.getAllRequestedReviewersInPullRequest(repository, number),
    );
    const requestedReviewers = await Promise.all(requestedReviewersPromises);

    const response = codeReviews.map(({ pullNumber, reviewers }) => {
      const pullRequestData = pullRequestsData.find(({ number }) => number === pullNumber);
      const requestedReviewer = requestedReviewers.find(({ pullNumber: number }) => pullNumber === number);

      return { reviewers, ...pullRequestData, requestedReviewer };
    });

    return { response };
  }
}
