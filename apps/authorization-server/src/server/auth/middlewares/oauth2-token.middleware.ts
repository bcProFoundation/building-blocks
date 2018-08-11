import { Injectable, NestMiddleware } from '@nestjs/common';
import { OAuth2orizeSetup } from './oauth2orize.setup';

@Injectable()
export class OAuth2TokenMiddleware implements NestMiddleware {
  constructor(private readonly oauthorizeSetup: OAuth2orizeSetup) {}
  public resolve(...args: any[]) {
    return this.oauthorizeSetup.server.token();
  }
}
