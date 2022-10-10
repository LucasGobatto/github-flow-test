import { Service } from 'typedi';
import { createAppAuth } from '@octokit/auth-app';
import { RequestInterface } from '@octokit/auth-app/dist-types/types';
import { OctokitResponse } from '@octokit/types/dist-types';
import { request } from '@octokit/request';
import { GithubUrl, RequestedReviewers } from '../model';
import { BranchDetails, CommitsModel } from './github.dto';
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

  async getPullRequestDetails(repository: string, pullNumber: number) {
    const response = await this.makeRequest(GithubUrl.GetPullRequestDetails, {
      repository,
      pullNumber,
    });

    return response?.data && mapPullRequests([response.data])[0];
  }

  async getReviewCommentOnPullRequest(repository: string, pullNumber: number) {
    // https://docs.github.com/en/rest/pulls/comments#get-a-review-comment-for-a-pull-request
    const comments = await this.makeRequest(GithubUrl.ListReviewCommentsOnPullRequest, {
      repository,
      pullNumber,
    });

    return comments.data;
  }

  async getAllRequestedReviewersInPullRequest(repository: string, pullNumber: number): Promise<RequestedReviewers> {
    // https://docs.github.com/en/rest/pulls/review-requests#get-all-requested-reviewers-for-a-pull-request
    const requestedReviewers = await this.makeRequest(GithubUrl.ListRequestedReviewsInPullRequest, {
      repository,
      pullNumber,
    });

    return requestedReviewers.data && mapRequestedReviewers(pullNumber, requestedReviewers.data);
  }

  async getAllReviewersInPullRequest(repository: string, pullNumber: number) {
    // https://docs.github.com/en/rest/pulls/reviews#list-reviews-for-a-pull-request
    const response = await this.makeRequest(GithubUrl.ListReviewersInPullRequest, {
      repository,
      pullNumber,
    });

    return response.data && mapReviewersInPullRequest(pullNumber, response.data);
  }

  async getAllCommitsInRepository(repository: string, since: Date, branch = 'develop'): Promise<CommitsModel[]> {
    // https://docs.github.com/en/rest/commits/commits#list-commits
    const response = await this.makeRequest(GithubUrl.ListCommitsInRepository, {
      repository,
      sha: branch,
      since: since.toISOString(),
    });

    return response.data;
  }

  async getAllCommitsOnPullRequest(repository: string, pullNumber: number): Promise<any> {
    const response = await this.makeRequest(GithubUrl.ListCommitsOnPullRequest, {
      repository,
      pullNumber,
    });

    return response.data;
  }

  async getAllBranchsInRepository(repository: string): Promise<string[]> {
    const response = await this.makeRequest<BranchDetails[]>(GithubUrl.ListAllBranchs, {
      repository,
    });

    return response?.data?.map((data) => data.name);
  }

  private makeRequest<T = any>(url: GithubUrl, data: any = {}): Promise<OctokitResponse<T, number>> {
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
