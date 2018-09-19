import { HttpException, HttpStatus } from '@nestjs/common';
import {
  SETTINGS_ALREADY_EXISTS,
  SOMETHING_WENT_WRONG,
} from './constants/messages';

export const settingsAlreadyExists = new HttpException(
  SETTINGS_ALREADY_EXISTS,
  HttpStatus.BAD_REQUEST,
);

export const somethingWentWrong = new HttpException(
  SOMETHING_WENT_WRONG,
  HttpStatus.BAD_REQUEST,
);
