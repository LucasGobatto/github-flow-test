import { Service } from 'typedi';
import { Request, Response } from 'express';
import { ExpressErrorMiddlewareInterface } from 'routing-controllers';

@Service()
export class HandleErrorMiddleware implements ExpressErrorMiddlewareInterface {
  error(error: Error & any, _: Request, response: Response, next: (err?: Error) => void) {
    if (error) {
      console.error({
        method: 'HandleErrorMiddleware',
        error: error,
        message: error.message,
        details: error?.details,
      });

      const code = error.code ?? 500;
      response.statusCode = code;
      response.send({
        message: error.message,
        details: error?.details,
        code,
      });
      next();
    } else {
      next();
    }
  }
}
