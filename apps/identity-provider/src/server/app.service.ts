import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  message() {
    return { message: 'NestJS' };
  }
}
