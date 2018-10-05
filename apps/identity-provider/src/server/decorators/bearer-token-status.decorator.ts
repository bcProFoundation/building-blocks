import {
  createParamDecorator,
  ForbiddenException,
  NotImplementedException,
} from '@nestjs/common';
import Axios from 'axios';
import { getConnection } from 'typeorm';
import { IdentityProviderSettings } from '../models/identity-provider-settings/identity-provider-settings.entity';
import { IdentityProviderSettingsService } from '../models/identity-provider-settings/identity-provider-settings.service';

export const BearerTokenStatus = createParamDecorator(async (data, req) => {
  // TODO: Show meaningful errors
  // headers are 'Bearer token_hash' and not just token_hash
  const identityProviderSettingsRepo = getConnection().getRepository(
    IdentityProviderSettings,
  );
  const identityProviderSettingsService = new IdentityProviderSettingsService(
    identityProviderSettingsRepo,
  );
  const settings = await identityProviderSettingsService.find();
  if (!settings) throw new NotImplementedException();
  const baseEncodedCred = Buffer.from(
    settings.clientId + ':' + settings.clientSecret,
  ).toString('base64');
  const accessToken = getAccessToken(req);
  if (accessToken) {
    const bearertokenData = await Axios.post(
      settings.authServerURL + '/oauth2/introspection',
      {
        token: accessToken,
      },
      {
        headers: {
          Authorization: 'Basic ' + baseEncodedCred,
        },
      },
    );
    return bearertokenData.data;
  } else {
    throw new ForbiddenException();
  }
});

export function getAccessToken(request) {
  return (
    request.query.access_token ||
    request.headers.authorization.split(' ')[1] ||
    null
  );
}
