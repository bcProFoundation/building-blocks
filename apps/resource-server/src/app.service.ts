import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  root(): string {
    return 'RS built using Nest.js!';
  }
}
