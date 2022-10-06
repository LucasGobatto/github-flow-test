import * as express from 'express';
import * as path from 'path';
import { useExpressServer } from 'routing-controllers';

export namespace Server {
  export function configure() {
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    useExpressServer(app, {
      controllers: [path.join(__dirname, '**', '*.controller.ts')],
      middlewares: [path.join(__dirname, '**', '*.middleware.ts')],
      defaultErrorHandler: false,
    });

    const PORT = process.env.PORT;

    app.listen(PORT, () => {
      console.log('listen at http://localhost:%s', PORT);
    });
  }
}
