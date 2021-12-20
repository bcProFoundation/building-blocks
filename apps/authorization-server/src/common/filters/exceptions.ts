import { HttpStatus, HttpException } from '@nestjs/common';
import { i18n } from '../../i18n/i18n.config';

export const invalidScopeException = new HttpException(
  i18n.__('Invalid Scope'),
  HttpStatus.FORBIDDEN,
);

export const invalidClientException = new HttpException(
  i18n.__('Invalid Client'),
  HttpStatus.FORBIDDEN,
);

export const invalidAuthorizationCodeException = new HttpException(
  i18n.__('Invalid Authorization Code'),
  HttpStatus.FORBIDDEN,
);

export const userAlreadyExistsException = new HttpException(
  i18n.__('User already exists'),
  HttpStatus.BAD_REQUEST,
);

export const invalidUserException = new HttpException(
  i18n.__('Invalid User'),
  HttpStatus.BAD_REQUEST,
);

export const twoFactorEnabledException = new HttpException(
  i18n.__('2FA already enabled'),
  HttpStatus.BAD_REQUEST,
);

export const twoFactorNotEnabledException = new HttpException(
  i18n.__('2FA not enabled'),
  HttpStatus.BAD_REQUEST,
);

export const invalidOTPException = new HttpException(
  i18n.__('Invalid OTP'),
  HttpStatus.BAD_REQUEST,
);

export const settingsNotFoundException = new HttpException(
  i18n.__('Settings not found'),
  HttpStatus.BAD_REQUEST,
);

export const JWKSNotFound = new HttpException(
  i18n.__('JWKS not found'),
  HttpStatus.BAD_REQUEST,
);

export const invalidRoleException = new HttpException(
  i18n.__('Invalid Role'),
  HttpStatus.BAD_REQUEST,
);

export const invalidSessionException = new HttpException(
  i18n.__('Invalid Session'),
  HttpStatus.BAD_REQUEST,
);

export const cannotDeleteAdministratorException = new HttpException(
  i18n.__('Cannot Delete Administrators'),
  HttpStatus.FORBIDDEN,
);

export const invalidCodeChallengeException = new HttpException(
  i18n.__('Invalid Code Challenge'),
  HttpStatus.BAD_REQUEST,
);

export const passwordLessLoginNotEnabledException = new HttpException(
  i18n.__('Password less login is not enabled'),
  HttpStatus.BAD_REQUEST,
);

export const passwordLessLoginAlreadyEnabledException = new HttpException(
  i18n.__('Password less login is already enabled'),
  HttpStatus.BAD_REQUEST,
);

export class CommunicationServerNotFoundException extends HttpException {
  constructor() {
    super(
      i18n.__('Communication Server not found'),
      HttpStatus.NOT_IMPLEMENTED,
    );
  }
}

export class PhoneAlreadyRegisteredException extends HttpException {
  constructor() {
    super(i18n.__('Phone number already registered'), HttpStatus.BAD_REQUEST);
  }
}

export class EventsNotConnectedException extends HttpException {
  constructor() {
    super(i18n.__('Events service not connected'), HttpStatus.NOT_IMPLEMENTED);
  }
}

export class PhoneRegistrationNotAllowedException extends HttpException {
  constructor() {
    super(
      i18n.__('Server does not allow phone registration'),
      HttpStatus.NOT_IMPLEMENTED,
    );
  }
}

export class InvalidVerificationCode extends HttpException {
  constructor() {
    super(i18n.__('Invalid Verification Code'), HttpStatus.UNAUTHORIZED);
  }
}

export class EmailForVerificationNotFound extends HttpException {
  constructor() {
    super(i18n.__('Email for verification not found'), HttpStatus.NOT_FOUND);
  }
}

export class UserDeleteDisabled extends HttpException {
  constructor() {
    super(
      i18n.__('Deleting user account is disabled'),
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export class InvalidRequestToDeleteUser extends HttpException {
  constructor() {
    super(i18n.__('user or client missing'), HttpStatus.UNAUTHORIZED);
  }
}

export class VerificationExpiredOrInvalid extends HttpException {
  constructor() {
    super(
      i18n.__(
        'Invalid or expired verification code used. Please signup again or reset password for the user.',
      ),
      HttpStatus.BAD_REQUEST,
    );
  }
}
