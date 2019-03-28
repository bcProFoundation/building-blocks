import { Injectable, NestMiddleware } from '@nestjs/common';
import { OAuth2orizeSetup } from './oauth2orize.setup';

@Injectable()
export class OAuth2ConfirmationMiddleware implements NestMiddleware {
  constructor(private readonly oauthorizeSetup: OAuth2orizeSetup) {}
  public use(request, response, next: () => void) {
    this.oauthorizeSetup.getCodeGrantMiddleware()(request, response, next);
  }
}
