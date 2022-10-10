import { Body, Get, JsonController, Req } from 'routing-controllers';
import { Service } from 'typedi';
import { Repository } from '../model';
import { GetMergedBranchsUseCase, GetCommitsInDevelopUseCase } from '../domain';

@Service()
@JsonController()
export class BranchController {
  constructor(
    private readonly getMergedBranchsUseCase: GetMergedBranchsUseCase,
    private readonly getCommitsInDevelopUseCase: GetCommitsInDevelopUseCase,
  ) {}

  @Get('/merged-branchs')
  getMergedBranchs(@Req() @Body() body: Repository) {
    return this.getMergedBranchsUseCase.exec(body);
  }

  @Get('/develop-commits')
  getCommitsInDevelop(@Req() @Body() body: Repository) {
    return this.getCommitsInDevelopUseCase.exec(body);
  }
}
