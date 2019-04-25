import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SESSION } from './session.schema';
import { Model } from 'mongoose';
import { Session } from './session.interface';

@Injectable()
export class SessionService {
  constructor(
    @InjectModel(SESSION)
    private readonly sessionModel: Model<Session>,
  ) {}

  async clear() {
    await this.sessionModel.deleteMany({});
  }
}
