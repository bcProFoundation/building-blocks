import {
  createParamDecorator,
  ForbiddenException,
  NotImplementedException,
} from '@nestjs/common';
import Axios from 'axios';
import { getConnection } from 'typeorm';
import { Client } from '../models/client/client.entity';
import { ClientService } from 'models/client/client.service';

export const BearerTokenStatus = createParamDecorator(async (data, req) => {
  // TODO: Show meaningful errors
  // header is 'Bearer token_hash' and not just token_hash
  const clientRepo = getConnection().getRepository(Client);
  const clientService = new ClientService(clientRepo);
  const client = await clientService.getClient();
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
