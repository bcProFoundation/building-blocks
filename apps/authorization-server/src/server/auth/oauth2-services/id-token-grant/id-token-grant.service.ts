import { Injectable } from '@nestjs/common';
import * as njwt from 'njwt';
import { IDTokenClaims } from '../../middlewares/interfaces';

@Injectable()
export class IDTokenGrantService {
  constructor() {}

  async grantIDToken(client, user, req, done) {
    try {
      const issuedAt = new Date().toString();

      const claims: IDTokenClaims = {
        iss: 'http://accounts.castlecraft.dev:4000', // Todo: Fetch from Settings
        aud: client.clientId,
        iat: Date.parse(issuedAt),
        exp: (Date.parse(issuedAt) + 3600) * 1000, // seconds * milliseconds
        sub: user.uuids,
      };

      const jwt = njwt.create(claims, client.clientSecret);
      const id_token = jwt.compact();
      done(null, id_token);
    } catch (error) {
      done(error, null);
    }
  }
}
