import { UnauthorizedException, createParamDecorator } from '@nestjs/common';
import { BearerTokenModel } from '../../models/bearer-token/bearer-token.schema';
import { BearerToken } from '../../models/bearer-token/bearer-token.interface';

export const Token = createParamDecorator(async (data, req) => {
  // headers are Bearer token_hash and not just token_hash

  const accessToken = getAccessToken(req);

  try {
    const bearerToken: BearerToken = await BearerTokenModel.findOne({
      accessToken,
    });
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
