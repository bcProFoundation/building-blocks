import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AUTH_DATA } from './auth-data.schema';
import { AuthData } from '../interfaces/auth-data.interface';

@Injectable()
export class AuthDataService {
  constructor(
    @InjectModel(AUTH_DATA) private readonly authDataModel: Model<AuthData>,
  ) {}

  async save(authData) {
    const createdAuthData = new this.authDataModel(authData);
    return await createdAuthData.save();
  }

  async findOne(params) {
    return await this.authDataModel.findOne(params);
  }

  getModel() {
    return this.authDataModel;
  }
}
