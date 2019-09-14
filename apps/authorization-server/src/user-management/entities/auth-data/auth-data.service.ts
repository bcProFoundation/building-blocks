import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { AUTH_DATA } from './auth-data.schema';
import { AuthData } from './auth-data.interface';

@Injectable()
export class AuthDataService {
  constructor(
    @Inject(AUTH_DATA) private readonly authDataModel: Model<AuthData>,
  ) {}

  async save(authData) {
    const createdAuthData = new this.authDataModel(authData);
    return await createdAuthData.save();
  }

  async findOne(params) {
    return await this.authDataModel.findOne(params);
  }

  async find(params?) {
    return await this.authDataModel.find(params).exec();
  }

  async remove(authData: AuthData) {
    return await authData.remove();
  }

  async deleteMany(params) {
    return await this.authDataModel.deleteMany(params);
  }
}
