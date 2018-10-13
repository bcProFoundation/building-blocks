import { HttpException, HttpStatus } from '@nestjs/common';
import { PLEASE_RUN_SETUP } from './messages';

export const clientNotSetupException = new HttpException(
  PLEASE_RUN_SETUP,
  HttpStatus.FORBIDDEN,
);
