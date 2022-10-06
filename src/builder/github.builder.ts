import { Service } from 'typedi';
import { createAppAuth } from '@octokit/auth-app';
import { RequestInterface } from '@octokit/auth-app/dist-types/types';
import { request } from '@octokit/request';
import { GithubUrl } from './github.model';
import {
  mapPullRequests,
  mapRepositories,
  mapRequestedReviewers,
  mapReviewersInPullRequest,
} from '../mappers/github.mapper';

@Service()
export class GitHubBuilder {
  private readonly request: RequestInterface;

  constructor() {
    this.request = this.getAuth();
  }

  async getRepositories() {
    // https://docs.github.com/en/rest/repos/repos#list-organization-repositories
    const { data } = await this.makeRequest(GithubUrl.ListRepositories, {
      sort: 'updated',
      direction: 'desc',
      per_page: 100,
    });

    return mapRepositories(data);
  }

  async getPullRequestsInRepository(repository: string) {
    // https://docs.github.com/en/rest/pulls/pulls#list-pull-requests
    const { data } = await this.makeRequest(GithubUrl.ListPullRequests, {
      repository,
      state: 'all',
      sort: 'updated',
      direction: 'desc',
      per_page: 100,
    });

    return mapPullRequests(data);
  }

  async getReviewCommentOnPullRequest(repository: string, pullNumber: number) {
    // https://docs.github.com/en/rest/pulls/comments#get-a-review-comment-for-a-pull-request
    const comments = await this.makeRequest(GithubUrl.ListReviewCommentsOnPullRequest, {
      repository,
      pullNumber,
    });

    return comments.data;
  }

  async getAllRequestedReviewersInPullRequest(repository: string, pullNumber: number) {
    // https://docs.github.com/en/rest/pulls/review-requests#get-all-requested-reviewers-for-a-pull-request
    const requestedReviewers = await this.makeRequest(GithubUrl.ListRequestedReviewsInPullRequest, {
      repository,
      pullNumber,
    });

    return requestedReviewers.data && mapRequestedReviewers(requestedReviewers.data);
  }

  async getAllReviewersInPullRequest(repository: string, pullNumber: number) {
    // https://docs.github.com/en/rest/pulls/reviews#list-reviews-for-a-pull-request
    const response = await this.makeRequest(GithubUrl.ListReviewersInPullRequest, {
      repository,
      pullNumber,
    });

    return response.data && mapReviewersInPullRequest(response.data);
  }

  async getAllCommitsInRepository(repository: string, since: Date) {
    // https://docs.github.com/en/rest/commits/commits#list-commits
    const response = await this.makeRequest(GithubUrl.ListCommitsInRepository, {
      repository,
      since: since.toISOString(),
    });

    return response.data;
  }

  private makeRequest(url: GithubUrl, data: any = {}) {
    return this.request(`GET ${url}`, data);
  }

  private getAuth() {
    const auth = createAppAuth({
      appId: process.env.APP_ID,
      privateKey: process.env.GITHUB_PRIVATE_KEY,
      oauth: {
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
      },
      installationId: process.env.INSTALLATION_ID,
    });

    return request.defaults({
      request: {
        hook: auth.hook,
      },
    });
  }
}
