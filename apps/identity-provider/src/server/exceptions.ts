import { HttpException, HttpStatus } from '@nestjs/common';
import { SETTINGS_ALREADY_EXISTS } from './constants/messages';

export const settingsAlreadyExists = new HttpException(
  SETTINGS_ALREADY_EXISTS,
  HttpStatus.BAD_REQUEST,
);
