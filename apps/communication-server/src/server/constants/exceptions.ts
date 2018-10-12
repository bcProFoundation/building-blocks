import { HttpException, HttpStatus } from '@nestjs/common';
import { PLEASE_SETUP_CLIENT } from './messages';

export const clientNotSetupException = new HttpException(
  PLEASE_SETUP_CLIENT,
  HttpStatus.FORBIDDEN,
);
