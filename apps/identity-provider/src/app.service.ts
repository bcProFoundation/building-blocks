import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  root(): string {
    return 'IDP built using Nest.js';
  }
}
