import { Body, Get, JsonController, Req } from 'routing-controllers';
import { Service } from 'typedi';
import { Repository } from '../model';
import { GetMergedBranchsUseCase } from '../domain';

@Service()
@JsonController()
export class BranchController {
  constructor(private readonly getMergedBranchsUseCase: GetMergedBranchsUseCase) {}

  @Get('/merged-branchs')
  getMergedBranchs(@Req() @Body() body: Repository) {
    return this.getMergedBranchsUseCase.exec(body);
  }
}
