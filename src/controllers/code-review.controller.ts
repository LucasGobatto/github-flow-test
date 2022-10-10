import { Service } from 'typedi';
import { Body, Get, JsonController, Req, UseAfter } from 'routing-controllers';
import { Repository } from '../model';
import { HandleErrorMiddleware } from '../middlewares/handle-error.middleware';
import { GetNumberOfCodeReviewInPullRequestUseCase } from '../domain';

@JsonController()
@Service()
@UseAfter(HandleErrorMiddleware)
export class CodeReviewController {
  constructor(private readonly getNumberOfCodeReviewInPullRequestUseCase: GetNumberOfCodeReviewInPullRequestUseCase) {}

  @Get('/code-review')
  getNumberOfCodeReview(@Req() @Body() body: Repository) {
    return this.getNumberOfCodeReviewInPullRequestUseCase.exec(body);
  }
}
