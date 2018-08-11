import { UnauthorizedException, createParamDecorator } from '@nestjs/common';
import { getConnection } from 'typeorm';
import { BearerToken } from '../../models/bearer-token/bearer-token.entity';

export const Token = createParamDecorator(async (data, req) => {
  // headers are Bearer token_hash and not just token_hash
  const tokenService = getConnection().getRepository(BearerToken);

  const accessToken = getAccessToken(req);

  try {
    const bearerToken = await tokenService.findOne({ accessToken });
    if (data === 'user') return bearerToken.user;
    else return bearerToken;
  } catch (error) {
    new UnauthorizedException();
  }
});

function getAccessToken(req) {
  try {
    return req.headers.authorization.split(' ')[1];
  } catch (error) {
    return req.query.access_token;
  }
}
