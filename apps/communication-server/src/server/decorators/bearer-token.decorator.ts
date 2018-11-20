import {
  createParamDecorator,
  ForbiddenException,
  NotImplementedException,
} from '@nestjs/common';
import Axios from 'axios';
import { getConnection, Repository } from 'typeorm';
import { ServerSettings } from '../models/server-settings/server-settings.entity';
import { ServerSettingsService } from '../models/server-settings/server-settings.service';
import { TokenCache } from '../models/token-cache/token-cache.entity';

export const BearerTokenStatus = createParamDecorator(async (data, req) => {
  const tokenCacheRepo = getConnection().getRepository(TokenCache);
  const serverSettingsRepo = getConnection().getRepository(ServerSettings);

  try {
    const accessToken = getAccessToken(req);
    const introspectedToken = await checkLocalToken(
      accessToken,
      tokenCacheRepo,
    );
    if (introspectedToken && introspectedToken.exp) {
      const now = new Date().getTime();
      if (now < introspectedToken.exp) {
        delete introspectedToken._id;
        delete introspectedToken.accessToken;
        delete introspectedToken.uuid;

        return introspectedToken;
      } else if (now > introspectedToken.exp) {
        await introspectedToken.remove();
        const newToken = await introspectToken(accessToken, serverSettingsRepo);
        if (newToken) {
          await cacheToken(newToken, accessToken, tokenCacheRepo);
          return newToken;
        }
      }
    } else {
      const freshToken = await introspectToken(accessToken, serverSettingsRepo);
      if (freshToken) {
        await cacheToken(freshToken, accessToken, tokenCacheRepo);
        return freshToken;
      }
    }
  } catch (error) {
    throw new ForbiddenException(error.message);
  }
  throw new ForbiddenException();
});

export function getAccessToken(request) {
  return (
    request.query.access_token ||
    request.headers.authorization.split(' ')[1] ||
    null
  );
}

export async function checkLocalToken(
  accessToken: string,
  tokenCacheRepo: Repository<TokenCache>,
) {
  const cachedToken = await tokenCacheRepo.findOne({ accessToken });
  return cachedToken;
}

export async function introspectToken(
  accessToken: string,
  serverSettingsRepo: Repository<ServerSettings>,
) {
  const settingsService = new ServerSettingsService(serverSettingsRepo);
  const settings = await settingsService.find();
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

export async function cacheToken(
  introspectedToken: any,
  accessToken: string,
  tokenCacheRepo: Repository<TokenCache>,
): Promise<TokenCache> {
  introspectedToken.accessToken = accessToken;
  introspectedToken.clientId = introspectedToken.client_id;
  delete introspectedToken.client_id;
  const cachedToken = await tokenCacheRepo.save(introspectedToken);
  delete cachedToken._id;
  delete cachedToken.accessToken;
  return cachedToken;
}
