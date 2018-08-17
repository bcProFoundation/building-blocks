import {
  INVALID_SCOPE,
  INVALID_CLIENT,
  INVALID_AUTHORIZATION_CODE,
} from '../../constants/messages';
import { HttpStatus, HttpException } from '@nestjs/common';

export const invalidScopeException = new HttpException(
  INVALID_SCOPE,
  HttpStatus.FORBIDDEN,
);

export const invalidClientException = new HttpException(
  INVALID_CLIENT,
  HttpStatus.FORBIDDEN,
);

export const invalidAuthorizationCodeException = new HttpException(
  INVALID_AUTHORIZATION_CODE,
  HttpStatus.FORBIDDEN,
);
