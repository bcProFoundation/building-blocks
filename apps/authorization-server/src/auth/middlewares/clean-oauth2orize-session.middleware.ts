import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class CleanOauth2orizeSessionMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    // clean old transactionID
    // https://github.com/jaredhanson/oauth2orize/issues/67#issuecomment-41131191
    if (req.session.authorize) {
      for (const key in req.session.authorize) {
        if (key !== req.oauth2.transactionID) {
          delete req.session.authorize[key];
        }
      }
    }
    next();
  }
}
