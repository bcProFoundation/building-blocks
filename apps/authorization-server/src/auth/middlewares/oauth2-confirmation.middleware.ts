import { Injectable, NestMiddleware } from '@nestjs/common';
import { OAuth2orizeSetup } from './oauth2orize.setup';

@Injectable()
export class OAuth2ConfirmationMiddleware implements NestMiddleware {
  constructor(private readonly oauthorizeSetup: OAuth2orizeSetup) {}
  public use(request, response, next: () => void) {
    // TODO: https://github.com/nestjs/docs.nestjs.com/issues/215
    // Middleware failure results in internal server error
    this.oauthorizeSetup.getCodeGrantMiddleware()(request, response, next);
  }
}
