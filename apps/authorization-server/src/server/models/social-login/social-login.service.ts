import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SOCIAL_LOGIN } from './social-login.schema';
import { Model } from 'mongoose';
import { SocialLogin } from '../interfaces/social-login.interface';

@Injectable()
export class SocialLoginService {
  constructor(
    @InjectModel(SOCIAL_LOGIN)
    private readonly socialLoginModel: Model<SocialLogin>,
  ) {}

  async save(params) {
    const createdScope = new this.socialLoginModel(params);
    return await createdScope.save();
  }

  async findOne(params) {
    return await this.socialLoginModel.findOne(params);
  }

  public async clear() {
    return await this.socialLoginModel.deleteMany({});
  }

  getModel() {
    return this.socialLoginModel;
  }

  public async find(params) {
    return await this.socialLoginModel.find(params);
  }

  async deleteOne(params) {
    return await this.socialLoginModel.deleteOne(params);
  }
}
