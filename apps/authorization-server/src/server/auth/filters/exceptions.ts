import {
  INVALID_SCOPE,
  INVALID_CLIENT,
  INVALID_AUTHORIZATION_CODE,
  USER_ALREADY_EXISTS,
  INVALID_USER,
  TWO_FACTOR_ALREADY_ENABLED,
  TWO_FACTOR_NOT_ENABLED,
  INVALID_OTP,
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

export const userAlreadyExistsException = new HttpException(
  USER_ALREADY_EXISTS,
  HttpStatus.BAD_REQUEST,
);

export const invalidUserException = new HttpException(
  INVALID_USER,
  HttpStatus.BAD_REQUEST,
);

export const twoFactorEnabledException = new HttpException(
  TWO_FACTOR_ALREADY_ENABLED,
  HttpStatus.BAD_REQUEST,
);

export const twoFactorNotEnabledException = new HttpException(
  TWO_FACTOR_NOT_ENABLED,
  HttpStatus.BAD_REQUEST,
);

export const invalidOTPException = new HttpException(
  INVALID_OTP,
  HttpStatus.BAD_REQUEST,
);
