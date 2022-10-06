import { Service } from 'typedi';
import { Body, Get, Req, UseAfter } from 'routing-controllers';
import { GitHubBuilder } from '../builder/github.builder';
import { HandleErrorMiddleware } from '../middlewares/handle-error.middleware';

@Service()
@UseAfter(HandleErrorMiddleware)
export class GithubController {
  constructor(private readonly githubBuilder: GitHubBuilder) {}

  @Get('/repositories')
  async getRepositories(@Req() @Body() body: any) {
    const response = await this.githubBuilder.getRepositories();

    return { response };
  }

  @Get('/pull-requests')
  async getPullRequestsInRepository(@Req() @Body() body: any) {
    const repository: string = body.repository;
    const response = await this.githubBuilder.getPullRequestsInRepository(repository);

    return { response };
  }

  @Get('/requested-reviewers')
  async getAllRequestedReviewersInPullRequest(@Req() @Body() body: any) {
    const { repository, pullNumber } = body;
    const response = await this.githubBuilder.getAllRequestedReviewersInPullRequest(repository, pullNumber);

    return { response };
  }

  @Get('/reviwers')
  async getReviwers(@Req() @Body() body: any) {
    const { repository, pullNumber } = body;
    const response = await this.githubBuilder.getAllReviewersInPullRequest(repository, pullNumber);

    return { response };
  }

  @Get('/comments-review')
  async getReviewComments(@Req() @Body() body: any) {
    const { repo, number } = body;
    const response = await this.githubBuilder.getReviewCommentOnPullRequest(repo, number);

    return { response };
  }

  @Get('/commits')
  async getAllCommits(@Req() @Body() body: any) {
    const { repository, since } = body;
    const response = await this.githubBuilder.getAllCommitsInRepository(repository, since);

    return { response };
  }
}
