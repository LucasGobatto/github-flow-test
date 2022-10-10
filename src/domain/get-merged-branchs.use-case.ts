import { Service } from 'typedi';
import { MergedPullRequestResponse, PullRequestAuthData, Repository, ServerResponseModel } from '../model';
import { GitHubBuilder } from '../builder/github.builder';
import { ONE_DAY_AND_TRHEE_HOURS } from './constants';

@Service()
export class GetMergedBranchsUseCase {
  constructor(private readonly githubBuilder: GitHubBuilder) {}

  async exec(input: Repository): ServerResponseModel<MergedPullRequestResponse> {
    const { repository } = input;

    if (!repository) {
      return;
    }

    const pullRequests = await this.githubBuilder.getPullRequestsInRepository(repository);
    const newestPullRequest = pullRequests.filter(
      (pr) => new Date(pr.updatedAt).getTime() >= Date.now() - ONE_DAY_AND_TRHEE_HOURS,
    );
    const mergedPullRequests = newestPullRequest.filter((pr) => pr.state === 'closed');
    const count = mergedPullRequests.length;
    const mappedResponse = mergedPullRequests.map((pr) => ({
      author: pr.author,
      title: pr.title,
      number: pr.number,
      url: pr.url,
    }));

    const aggregateByAuthor = mappedResponse.reduce<Record<string, PullRequestAuthData>>((agg, detail) => {
      if (agg && agg[detail.author.id]) {
        const count = agg.id.count + 1;
        const pullRequests = [...agg.id.pullRequests, { title: detail.title, number: detail.number, url: detail.url }];
        agg.id = { ...agg.id, count, pullRequests };
      } else {
        const pullRequests = [{ title: detail.title, number: detail.number, url: detail.url }];
        agg = { ...(agg ?? {}), [detail.author.id]: { author: detail.author, count: 1, pullRequests, repository } };
      }

      return agg;
    }, {});

    return { response: { count, authorData: Object.values(aggregateByAuthor) } };
  }
}
