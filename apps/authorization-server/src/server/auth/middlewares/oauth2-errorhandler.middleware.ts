import { Injectable, NestMiddleware } from '@nestjs/common';
import { OAuth2orizeSetup } from './oauth2orize.setup';

@Injectable()
export class OAuth2ErrorHandlerMiddleware implements NestMiddleware {
  constructor(private readonly oauthorizeSetup: OAuth2orizeSetup) {}
  public use(request, response, next: () => void) {
    this.oauthorizeSetup.server.errorHandler()(request, response, next);
  }
}
