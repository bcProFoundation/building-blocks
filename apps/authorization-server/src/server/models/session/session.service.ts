import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SESSION } from './session.schema';
import { Session } from './session.interface';
import { invalidSessionException } from '../../auth/filters/exceptions';

@Injectable()
export class SessionService {
  constructor(
    @InjectModel(SESSION) private readonly sessionModel: Model<Session>,
  ) {}

  async update(query, params) {
    return await this.sessionModel.update(query, params);
  }

  async save(params) {
    const checkSession = await this.findOne({ sid: params.sid });
    if (checkSession) throw invalidSessionException;
    const createdSession = new this.sessionModel(params);
    return await createdSession.save();
  }

  async find() {
    return await this.sessionModel.find().exec();
  }

  async delete(params) {
    return await this.sessionModel.deleteOne(params);
  }

  async clear() {
    return await this.sessionModel.deleteMany({});
  }

  async count() {
    return await this.sessionModel.estimatedDocumentCount();
  }

  async findOne(params) {
    return await this.sessionModel.findOne(params);
  }
}
