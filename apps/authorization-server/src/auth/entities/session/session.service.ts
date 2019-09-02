import { Injectable, Inject } from '@nestjs/common';
import { SESSION } from './session.schema';
import { Model } from 'mongoose';
import { Session } from './session.interface';

@Injectable()
export class SessionService {
  constructor(
    @Inject(SESSION)
    private readonly sessionModel: Model<Session>,
  ) {}

  async clear() {
    await this.sessionModel.deleteMany({});
  }
}
