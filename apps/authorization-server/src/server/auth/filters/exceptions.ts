import {
  INVALID_SCOPE,
  INVALID_CLIENT,
  INVALID_AUTHORIZATION_CODE,
  USER_ALREADY_EXISTS,
  INVALID_USER,
  TWO_FACTOR_ALREADY_ENABLED,
  TWO_FACTOR_NOT_ENABLED,
  INVALID_OTP,
  SETTING_NOT_FOUND,
  JWKS_NOT_FOUND,
  INVALID_ROLE,
  INVALID_SESSION,
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

export const settingsNotFoundException = new HttpException(
  SETTING_NOT_FOUND,
  HttpStatus.BAD_REQUEST,
);

export const JWKSNotFound = new HttpException(
  JWKS_NOT_FOUND,
  HttpStatus.BAD_REQUEST,
);

export const invalidRoleException = new HttpException(
  INVALID_ROLE,
  HttpStatus.BAD_REQUEST,
);

export const invalidSessionException = new HttpException(
  INVALID_SESSION,
  HttpStatus.BAD_REQUEST,
);
