import { HttpException, HttpStatus } from '@nestjs/common';
import {
  SOMETHING_WENT_WRONG,
  SETUP_ALREADY_COMPLETE,
} from './constants/messages';

export const settingsAlreadyExists = new HttpException(
  SETUP_ALREADY_COMPLETE,
  HttpStatus.BAD_REQUEST,
);

export const somethingWentWrong = new HttpException(
  SOMETHING_WENT_WRONG,
  HttpStatus.BAD_REQUEST,
);
