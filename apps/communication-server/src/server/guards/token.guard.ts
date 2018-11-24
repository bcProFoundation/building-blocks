import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotImplementedException,
} from '@nestjs/common';
import { ServerSettingsService } from '../models/server-settings/server-settings.service';
import { TokenCache } from '../models/token-cache/token-cache.entity';
import { TokenCacheService } from '../models/token-cache/token-cache.service';
import Axios from 'axios';
import { TOKEN } from '../constants/app-strings';

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(
    private readonly settingsService: ServerSettingsService,
    private readonly tokenCacheService: TokenCacheService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const httpContext = context.switchToHttp();
    const req = httpContext.getRequest();
    const accessToken = this.getAccessToken(req);
    const introspectedToken = await this.checkLocalToken(accessToken);
    if (introspectedToken && introspectedToken.exp) {
      const now = new Date().getTime();
      if (now < introspectedToken.exp) {
        delete introspectedToken._id;
        delete introspectedToken.uuid;
        req[TOKEN] = introspectedToken;
        return introspectedToken.active;
      } else if (now > introspectedToken.exp) {
        await introspectedToken.remove();
        const newToken = await this.introspectToken(accessToken);
        if (newToken) {
          await this.cacheToken(newToken, accessToken);
          req[TOKEN] = newToken;
          return newToken.active;
        }
      }
    } else {
      const freshToken = await this.introspectToken(accessToken);
      if (freshToken) {
        await this.cacheToken(freshToken, accessToken);
        req[TOKEN] = freshToken;
        return freshToken.active;
      }
    }
  }

  getAccessToken(request) {
    if (!request.headers.authorization) {
      if (!request.query.access_token) return null;
    }
    return (
      request.query.access_token ||
      request.headers.authorization.split(' ')[1] ||
      null
    );
  }

  async checkLocalToken(accessToken: string) {
    const cachedToken = await this.tokenCacheService.findOne({ accessToken });
    return cachedToken;
  }

  async introspectToken(accessToken: string) {
    const settings = await this.settingsService.find();
    if (!settings) throw new NotImplementedException();

    // header is 'Bearer token_hash' and not just token_hash
    const baseEncodedCred = Buffer.from(
      settings.clientId + ':' + settings.clientSecret,
    ).toString('base64');
    const bearertokenData = await Axios.post(
      settings.introspectionURL,
      {
        token: accessToken,
      },
      {
        headers: {
          Authorization: 'Basic ' + baseEncodedCred,
        },
      },
    );
    if (bearertokenData.data.active) return bearertokenData.data;
  }

  async cacheToken(
    introspectedToken: any,
    accessToken: string,
  ): Promise<TokenCache> {
    introspectedToken.accessToken = accessToken;
    introspectedToken.clientId = introspectedToken.client_id;
    delete introspectedToken.client_id;
    const cachedToken = await this.tokenCacheService.save(introspectedToken);
    delete cachedToken._id;
    return cachedToken;
  }
}
