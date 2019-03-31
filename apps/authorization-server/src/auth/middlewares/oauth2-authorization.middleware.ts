import { Injectable, NestMiddleware } from '@nestjs/common';
import { OAuth2orizeSetup } from './oauth2orize.setup';

@Injectable()
export class OAuth2AuthorizationMiddleware implements NestMiddleware {
  constructor(private readonly oauthorizeSetup: OAuth2orizeSetup) {}
  public use(request, response, next: () => void) {
    this.oauthorizeSetup.server.decision()[0](request, response, next);
  }
}
