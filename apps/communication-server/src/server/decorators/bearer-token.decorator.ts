import {
  createParamDecorator,
  ForbiddenException,
  NotImplementedException,
} from '@nestjs/common';
import Axios from 'axios';
import { getConnection } from 'typeorm';
import { ServerSettings } from '../models/server-settings/server-settings.entity';
import { ServerSettingsService } from '../models/server-settings/server-settings.service';

export const BearerTokenStatus = createParamDecorator(async (data, req) => {
  // TODO: Show meaningful errors
  // header is 'Bearer token_hash' and not just token_hash
  const clientRepo = getConnection().getRepository(ServerSettings);
  const clientService = new ServerSettingsService(clientRepo);
  const client = await clientService.find();
  if (!client) throw new NotImplementedException();
  const baseEncodedCred = Buffer.from(
    client.clientId + ':' + client.clientSecret,
  ).toString('base64');
  const accessToken = getAccessToken(req);
  if (accessToken) {
    const bearertokenData = await Axios.post(
      'http://localhost:3000/oauth2/introspection',
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
