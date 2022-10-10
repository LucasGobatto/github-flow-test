import { Service } from 'typedi';
import { GitHubBuilder } from '../builder/github.builder';
import { MergedPullRequestResponse, PullRequestAuthData, Repository, ServerResponseModel } from '../model';
import { ONE_DAY_AND_TRHEE_HOURS } from './constants';

@Service()
export class GetCommitsInDevelopUseCase {
  constructor(private readonly githubBuilder: GitHubBuilder) {}

  async exec(input: Repository): ServerResponseModel<MergedPullRequestResponse> {
    const { repository } = input;
    const mergedMessage = 'Merge pull request #';
    const since = new Date(Date.now() - ONE_DAY_AND_TRHEE_HOURS);
    const commits = await this.githubBuilder.getAllCommitsInRepository(repository, since);

    const filteredCommits = commits.filter((data) => data.commit.message.indexOf(mergedMessage) !== -1);
    const pullNumbers = filteredCommits.map((data) =>
      Number(data.commit.message.replace(mergedMessage, '').split(/\sfrom/)[0]),
    );

    const promises = pullNumbers.map((pullNumber) => this.githubBuilder.getPullRequestDetails(repository, pullNumber));
    const pullRequestDetails = await Promise.all(promises);

    const sortedResponse = pullRequestDetails.reduce<Record<string, PullRequestAuthData>>((agg, detail) => {
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

    const authorData = Object.values(sortedResponse);
    const response = { count: authorData.length, authorData };

    return { response };
  }
}
